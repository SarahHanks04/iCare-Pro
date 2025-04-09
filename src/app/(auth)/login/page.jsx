// "use client";

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { loginUser } from "@/app/_lib/api";
// import { loginSuccess } from "@/app/redux/slices/authSlice";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       console.log("Attempting login with:", { email, password });
//       const data = await loginUser(email, password);
//       console.log("Login successful, data:", data);
//       dispatch(loginSuccess({ user: { email }, token: data.token }));
//       console.log("Dispatch successful, redirecting to /");
//         router.push('/');
//     } catch (err) {
//       console.error("Login error:", err.message);
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           Welcome to Door2day Health Care
//         </h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full p-2 border rounded cursor-pointer"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full p-2 border rounded cursor-pointer"
//               required
//             />
//             <div className="mt-2 flex items-center">
//               <input
//                 type="checkbox"
//                 checked={showPassword}
//                 onChange={() => setShowPassword(!showPassword)}
//                 className="mr-2 cursor-pointer"
//               />
//               <label className="text-gray-700">Show Password</label>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-[#11453B] cursor-pointer text-white p-2 rounded"
//           >
//             Login
//           </button>
//         </form>
//         <p className="mt-4 text-center">
//           Don't have an account?{" "}
//           <Link
//             href="/register"
//             className="text-[#11453B] hover:underline cursor-pointer"
//           >
//             Register
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// WITH FORMIK
"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginUser } from "@/app/_lib/api";
import { loginSuccess } from "@/app/redux/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
    showPassword: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      console.log("Attempting login with:", {
        email: values.email,
        password: values.password,
      });
      const data = await loginUser(values.email, values.password);
      console.log("Login successful, data:", data);
      dispatch(
        loginSuccess({ user: { email: values.email }, token: data.token })
      );
      console.log("Dispatch successful, redirecting to /");
      router.push("/");
    } catch (err) {
      console.error("Login error:", err.message);
      setFieldError("general", err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Welcome to Door2day Health Care
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded cursor-pointer"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <Field
                  type={values.showPassword ? "text" : "password"}
                  name="password"
                  className="w-full p-2 border rounded cursor-pointer"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
                <div className="mt-2 flex items-center">
                  <Field
                    type="checkbox"
                    name="showPassword"
                    checked={values.showPassword}
                    onChange={() =>
                      setFieldValue("showPassword", !values.showPassword)
                    }
                    className="mr-2 cursor-pointer"
                  />
                  <label className="text-gray-700">Show Password</label>
                </div>
              </div>
              <ErrorMessage
                name="general"
                component="p"
                className="text-red-500 mb-4"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#11453B] cursor-pointer text-white p-2 rounded disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-[#11453B] hover:underline cursor-pointer"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
