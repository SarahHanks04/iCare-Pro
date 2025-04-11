"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "../../_lib/api";
import { loginSuccess } from "../../redux/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await loginUser(values.email, values.password);
      console.log("Login Response:", response);

      const isMockToken = response.token.startsWith("mock-token-");

      let userName = "User";
      if (isMockToken) {
        const mockedUsers =
          JSON.parse(localStorage.getItem("mockedUsers")) || [];
        const user = mockedUsers.find(
          (u) => u.email.toLowerCase() === values.email.toLowerCase()
        );
        if (user) {
          userName = user.name || "User";
        }
      }

      dispatch(
        loginSuccess({
          email: values.email,
          name: userName,
          token: response.token,
        })
      );
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
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
              <div>
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
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="mr-2"
                  />
                  <label className="text-sm text-gray-600">Show Password</label>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#11453B] text-white p-2 rounded hover:bg-[#0d3b33]"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        <p className="mt-5 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-[#11453B] hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
