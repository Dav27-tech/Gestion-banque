import React from 'react';
import { usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

const firstMessage = (value) => {
    if (Array.isArray(value)) {
        return value[0];
    }

    return value;
};

export default function ApplicationFeedback() {
    const { errors = {}, flash = {} } = usePage().props;
    const errorMessages = Object.values(errors)
        .map(firstMessage)
        .filter(Boolean);
    const successMessage = flash?.success;
    const flashError = flash?.error;

    if (!successMessage && !flashError && errorMessages.length === 0) {
        return null;
    }

    const isError = Boolean(flashError || errorMessages.length);
    const messages = flashError
        ? [flashError]
        : successMessage
          ? [successMessage]
          : errorMessages;
    const Icon = isError ? XCircle : CheckCircle2;

    return (
        <div
            role="alert"
            className={`mb-6 rounded-xl border p-4 shadow-sm ${
                isError
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-800'
            }`}
        >
            <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                <div className="min-w-0">
                    <div className="text-sm font-bold">
                        {isError ? 'Action impossible' : 'Action réussie'}
                    </div>
                    <div className="mt-1 space-y-1 text-sm font-medium">
                        {messages.map((message, index) => (
                            <p key={`${message}-${index}`} className="m-0">
                                {message}
                            </p>
                        ))}
                    </div>
                </div>
                {isError && errorMessages.length > 1 && !flashError && (
                    <AlertTriangle className="ml-auto h-4 w-4 shrink-0 opacity-70" />
                )}
            </div>
        </div>
    );
}
