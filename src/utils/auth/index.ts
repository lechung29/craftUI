/** @format */

export interface ValidationError {
    field: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

export const validateEmail = (email: string): ValidationError | null => {
    if (!email || email.trim().length === 0) {
        return {
            field: "email",
            message: "Email cannot be empty",
        };
    }

    if (email.trim().length > 255) {
        return {
            field: "email",
            message: "Email must not exceed 255 characters",
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim().toLowerCase())) {
        return {
            field: "email",
            message: "Invalid email format. Please enter a valid email",
        };
    }

    return null;
};

export const validateUsername = (userName: string): ValidationError | null => {
    if (!userName || userName.trim().length === 0) {
        return {
            field: "userName",
            message: "Username cannot be empty",
        };
    }

    if (userName.trim().length < 3) {
        return {
            field: "userName",
            message: "Username must be at least 3 characters",
        };
    }

    if (userName.trim().length > 50) {
        return {
            field: "userName",
            message: "Username must not exceed 50 characters",
        };
    }

    return null;
};

export const validatePassword = (password: string): ValidationError | null => {
    if (!password || password.length === 0) {
        return {
            field: "password",
            message: "Password cannot be empty",
        };
    }

    if (password.length < 6) {
        return {
            field: "password",
            message: "Password must be at least 6 characters",
        };
    }

    if (password.length > 128) {
        return {
            field: "password",
            message: "Password must not exceed 128 characters",
        };
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strongPasswordRegex.test(password)) {
        return {
            field: "password",
            message: "Password must contain at least one uppercase letter, lowercase letter and number",
        };
    }

    return null;
};

export const validateLoginForm = (email: string, password: string): ValidationResult => {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) errors.push(passwordError);

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateRegisterForm = (userName: string, email: string, password: string): ValidationResult => {
    const errors: ValidationError[] = [];

    const usernameError = validateUsername(userName);
    if (usernameError) errors.push(usernameError);

    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);

    const passwordError = validatePassword(password);
    if (passwordError) errors.push(passwordError);

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const validateForgotPasswordForm = (email: string): ValidationResult => {
    const errors: ValidationError[] = [];

    const emailError = validateEmail(email);
    if (emailError) errors.push(emailError);

    return {
        isValid: errors.length === 0,
        errors,
    };
};

export const sanitizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
};

export const sanitizeUsername = (userName: string): string => {
    return userName.trim();
};

export const getFirstError = (validationResult: ValidationResult): string | null => {
    if (validationResult.errors.length > 0) {
        return validationResult.errors[0].message;
    }
    return null;
};

export const getFieldError = (validationResult: ValidationResult, field: string): string | null => {
    const error = validationResult.errors.find((err) => err.field === field);
    return error ? error.message : null;
};
