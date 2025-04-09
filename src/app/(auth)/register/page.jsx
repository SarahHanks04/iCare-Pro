// "use client";

// import { useState } from "react";

// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { registerUser } from "@/app/_lib/api";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       await registerUser(email, password);
//       setSuccessMessage(
//         "Account created successfully! Please use the details to log in now."
//       );
//       setError(null);
//       setTimeout(() => {
//         router.push("/login");
//       }, 3000);
//     } catch (err) {
//       setError(err.message);
//       setSuccessMessage(null);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           Create an Account
//         </h2>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         {successMessage && (
//           <p className="text-green-500 mb-4">{successMessage}</p>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full p-2 border rounded cursor-pointer"
//               required
//             />
//           </div>
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
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700">Confirm Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
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
//             className="w-full bg-[#11453B] text-white p-2 rounded cursor-pointer"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// WITH FORMIK
"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "@/app/_lib/api";

export default function Register() {
  const router = useRouter();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await registerUser(values.email, values.password);
      setFieldError("general", null);
      setFieldError(
        "success",
        "Account created successfully! Redirecting to login..."
      );
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setFieldError("general", err.message);
      setFieldError("success", null);
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create an Account
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full p-2 border rounded cursor-pointer"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
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
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Confirm Password</label>
                <Field
                  type={values.showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full p-2 border rounded cursor-pointer"
                />
                <ErrorMessage
                  name="confirmPassword"
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
              <ErrorMessage
                name="success"
                component="p"
                className="text-green-500 mb-4"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#11453B] text-white p-2 rounded cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
