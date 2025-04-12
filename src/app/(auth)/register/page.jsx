"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "../../_lib/api";
import { useDispatch } from "react-redux";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await registerUser(values.email, values.password);

      const mockedUsers = JSON.parse(localStorage.getItem("mockedUsers")) || [];
      const existingUserIndex = mockedUsers.findIndex(
        (u) => u.email.toLowerCase() === values.email.toLowerCase()
      );

      const newUser = {
        id: response.id,
        email: values.email,
        name: values.name,
        password: values.password,
      };

      if (existingUserIndex !== -1) {
        mockedUsers[existingUserIndex] = newUser;
      } else {
        mockedUsers.push(newUser);
      }

      localStorage.setItem("mockedUsers", JSON.stringify(mockedUsers));
      console.log("Updated Mocked Users:", mockedUsers);

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#11453B]">
          Register
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div className="text-black">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded focus:outline-none"
                  placeholder="Enter your name... "
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="text-black">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded focus:outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="text-black">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-2 border rounded focus:outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="text-black">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full p-2 border rounded focus:outline-none"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label className="text-sm text-black">Show Password</label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#11453B] text-white p-2 rounded hover:bg-[#0d3b33]"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        {success && (
          <div className="mt-4 text-[#11453B] text-center">{success}</div>
        )}
        <p className="mt-5 text-center text-black">
          Already have an account?{" "}
          <a href="/login" className="text-[#11453B] hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
