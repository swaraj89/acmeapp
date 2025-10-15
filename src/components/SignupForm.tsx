import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css";

interface FormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface PasswordCriteria {
  minLength: boolean;
  hasUppercase: boolean;
  hasSymbol: boolean;
  hasDigit: boolean;
  notSameAsUsername: boolean;
}

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Validate password criteria in real-time
  const passwordCriteria = useMemo<PasswordCriteria>(() => {
    const { password, username } = formData;
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
      hasDigit: /\d/.test(password),
      notSameAsUsername:
        password !== username && password.length > 0 && username.length > 0,
    };
  }, [formData.password, formData.username]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordCriteria).every((criteria) => criteria);
  }, [passwordCriteria]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!isPasswordValid) {
      newErrors.password = "Password does not meet all criteria";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Simulate successful signup
      console.log("Signup successful:", formData);
      navigate("/dashboard");
    }
  };

  const getCriteriaClassName = (isMet: boolean) => {
    return `criteria-item ${isMet ? "criteria-met" : "criteria-not-met"}`;
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-layout">
            {/* Left Column - Form Fields */}
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={errors.username ? "error" : ""}
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? "error" : ""}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>

            {/* Right Column - Password Criteria */}
            <div className="criteria-column">
              <div className="password-criteria">
                <h4>Password Requirements:</h4>
                <ul>
                  <li
                    className={getCriteriaClassName(passwordCriteria.minLength)}
                  >
                    ✓ At least 8 characters long
                  </li>
                  <li
                    className={getCriteriaClassName(
                      passwordCriteria.hasUppercase
                    )}
                  >
                    ✓ Contains at least 1 uppercase letter
                  </li>
                  <li
                    className={getCriteriaClassName(passwordCriteria.hasSymbol)}
                  >
                    ✓ Contains at least 1 symbol
                  </li>
                  <li
                    className={getCriteriaClassName(passwordCriteria.hasDigit)}
                  >
                    ✓ Contains at least 1 digit
                  </li>
                  <li
                    className={getCriteriaClassName(
                      passwordCriteria.notSameAsUsername
                    )}
                  >
                    ✓ Password cannot be the same as username
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={
              !isPasswordValid || formData.password !== formData.confirmPassword
            }
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
