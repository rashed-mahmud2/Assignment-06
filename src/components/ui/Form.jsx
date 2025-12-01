"use client";

import React, { createContext, useContext, useId } from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import styles from "./form.module.css";

// -----------------------------------------------------------
// CONTEXTS
// -----------------------------------------------------------
const FormFieldContext = createContext({});
const FormItemContext = createContext({});

// -----------------------------------------------------------
// HOOK: useFormField
// -----------------------------------------------------------
function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);

  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext.name) {
    throw new Error("useFormField must be used inside <FormField />");
  }

  return {
    id: itemContext.id,
    name: fieldContext.name,
    error: fieldState.error,
    formItemId: `${itemContext.id}-item`,
    formDescriptionId: `${itemContext.id}-description`,
    formMessageId: `${itemContext.id}-message`,
  };
}

// -----------------------------------------------------------
// COMPONENTS
// -----------------------------------------------------------

// Provider
const Form = FormProvider;

// FormField (Wrapper around React Hook Form Controller)
function FormField(props) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

// Wrapper for each field
function FormItem({ children }) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={styles.formItem}>{children}</div>
    </FormItemContext.Provider>
  );
}

// Label
function FormLabel({ children }) {
  const { error, formItemId } = useFormField();

  return (
    <label
      htmlFor={formItemId}
      className={`${styles.label} ${error ? styles.labelError : ""}`}
    >
      {children}
    </label>
  );
}

// Control wrapper (input, select, textarea)
function FormControl({ children }) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return React.cloneElement(children, {
    id: formItemId,
    "aria-invalid": !!error,
    "aria-describedby": error
      ? `${formDescriptionId} ${formMessageId}`
      : formDescriptionId,
    className: `${children.props.className || ""} ${
      error ? styles.controlError : ""
    }`,
  });
}

// Description
function FormDescription({ children }) {
  const { formDescriptionId } = useFormField();

  return (
    <p id={formDescriptionId} className={styles.description}>
      {children}
    </p>
  );
}

// Error message
function FormMessage({ children }) {
  const { error, formMessageId } = useFormField();
  const message = error ? error.message : children;

  if (!message) return null;

  return (
    <p id={formMessageId} className={styles.message}>
      {message}
    </p>
  );
}

// -----------------------------------------------------------
// FINAL EXPORT (everything together)
// -----------------------------------------------------------
export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
};
