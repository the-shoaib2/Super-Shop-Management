import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context/auth-context"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader, Eye, EyeOff } from "lucide-react"
import React, { useCallback } from "react"
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { AuthService } from "@/services/auth"


// Select options declarations


const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
]

// Form validation rules
const VALIDATION_RULES = {
  firstName: {
    required: "First name is required",
    minLength: { value: 2, message: "First name must be at least 2 characters" },
    maxLength: { value: 50, message: "First name must not exceed 50 characters" },
  },
  lastName: {
    required: "Last name is required",
    minLength: { value: 2, message: "Last name must be at least 2 characters" },
    maxLength: { value: 50, message: "Last name must not exceed 50 characters" },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: { value: 8, message: "Password must be at least 8 characters" },
    maxLength: { value: 32, message: "Password must not exceed 32 characters" }
  },
  termsAccepted: {
    required: "You must accept the terms and conditions to create an account"
  }
}



export function RegisterForm({ className, ...props }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  // Form state management - remove role from initial state
  const [formData, setFormData] = useState(() => {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false
    }
  })

  // Add state for password visibility
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData(prev => {
      if (name.startsWith('dateOfBirth.')) {
        const [_, field] = name.split('.')
        return {
          ...prev,
          dateOfBirth: {
            ...prev.dateOfBirth,
            [field]: value
          }
        }
      }

      if (type === 'checkbox') {
        return {
          ...prev,
          [name]: checked
        }
      }

      return {
        ...prev,
        [name]: value
      }
    })
  }

  async function onSubmit(event) {
    event.preventDefault()
    setLoading(true)

    const validationErrors = validateForm(formData)

    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error))
      setLoading(false)
      return
    }

    try {
      // Format the data according to the API requirements - role is hardcoded as PATIENT
      const dataToSubmit = {
        role: "PATIENT", // Hardcoded as PATIENT
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        termsAccepted: formData.termsAccepted
      }

      // Use AuthService directly instead of register from context
      const response = await AuthService.register(dataToSubmit)

      // Only proceed with login if registration was successful (201 Created)
      if (response.status === 201) {
        toast.success('Registration successful')

        // Auto-login after successful registration
        try {
          await login({
            email: formData.email,
            password: formData.password
          })

          // Navigate first, then show toasts
          navigate('/')

          // Stagger toasts for better UX
          setTimeout(() => {
            toast.success('Please verify your email to continue!')
          }, 1500)
        } catch (loginError) {
          console.error('Auto-login failed:', loginError)
          navigate('/login')
          setTimeout(() => {
            toast.success('Please log in with your new account')
          }, 800)
        }
      } else {
        // Handle unexpected response
        toast.success('Account created, please log in')
        navigate('/login')
      }
    } catch (error) {
      // Enhanced error handling
      if (error.response?.status === 409) {
        toast.error('An account with this email already exists. Please try logging in instead.')
      } else if (error.errors) {
        error.errors.forEach(err => {
          if (err.field === 'description' && err.message.includes('empty')) {
            return
          }
          toast.error(`${err.field}: ${err.message}`)
        })
      } else {
        toast.error(error.message || 'Registration failed')
      }
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (data) => {
    const errors = []

    // Validate first name
    if (!data.firstName) {
      errors.push(VALIDATION_RULES.firstName.required)
    } else if (data.firstName.length < 2) {
      errors.push(VALIDATION_RULES.firstName.minLength.message)
    }

    // Validate last name
    if (!data.lastName) {
      errors.push(VALIDATION_RULES.lastName.required)
    } else if (data.lastName.length < 2) {
      errors.push(VALIDATION_RULES.lastName.minLength.message)
    }

    // Validate email
    if (!data.email) {
      errors.push(VALIDATION_RULES.email.required)
    } else if (!VALIDATION_RULES.email.pattern.value.test(data.email)) {
      errors.push(VALIDATION_RULES.email.pattern.message)
    }

    // Password validation with max length
    if (!data.password) {
      errors.push(VALIDATION_RULES.password.required)
    } else if (data.password.length < 8) {
      errors.push(VALIDATION_RULES.password.minLength.message)
    } else if (data.password.length > 32) {
      errors.push(VALIDATION_RULES.password.maxLength.message)
    }

    // Password confirmation check
    if (data.password !== data.confirmPassword) {
      errors.push("Passwords do not match")
    }

    // Validate terms acceptance
    if (!data.termsAccepted) {
      errors.push(VALIDATION_RULES.termsAccepted.required)
    }

    return errors
  }

  return (
    <div className={cn("flex flex-col w-full gap-3", className)} {...props}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1 pb-4 text-center">
          <CardTitle className="text-xl font-bold ">Create an account</CardTitle>
          <CardDescription>
            Enter your credentials to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-row gap-3">
              <Button variant="outline" className="w-full h-9">
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" />
                </svg>
                Apple
              </Button>
              <Button variant="outline" className="w-full h-9">
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                </svg>
                Google
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Name Fields - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            {/* Password Fields - Side by Side */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pr-10"
                    placeholder="********"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="pr-10"
                    placeholder="********"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) =>
                  handleChange({ target: { name: 'termsAccepted', type: 'checkbox', checked } })
                }
                required
              />
              <Label htmlFor="termsAccepted" className="text-sm">
                I accept the terms and conditions <span className="text-destructive">*</span>
              </Label>
            </div>

            <Button type="submit" className="w-full h-9" disabled={loading}>
              {loading ? (
                <>
                  Creating account...
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline font-bold">
              Login
            </a>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground max-w-md mx-auto">
        By clicking continue, you agree to our{" "}
        <Link to="/legal/terms" className="hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/legal/privacy" className="hover:text-primary">
          Privacy Policy
        </Link>
      </div>
    </div>
  )
} 