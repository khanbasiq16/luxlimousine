
"use client"
import { useState } from "react";
import axios from "axios";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Page = () => {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle file select
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Validation function for Step 1
  const validateStep1 = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email address");
      return false;
    }
    return true;
  };

  // Validation function for Step 2
  const validateStep2 = () => {
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Invalid phone number");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return; // validate before submit
    setLoading(true);

    try {
      const formPayload = new FormData();
      formPayload.append("name", formData.name);
      formPayload.append("email", formData.email);
      formPayload.append("password", formData.password);
      formPayload.append("phone", formData.phone);

      if (file) {
        formPayload.append("profile_image", file);
      }

      const response = await axios.post("/api/register", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        router.push("/");
      }
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden md:flex w-1/2 flex-col justify-center items-center text-center p-10 bg-gray-100">
        <img
          src="/logo.png"
          alt="Taxi Service Logo"
          className="w-auto h-20 mb-6"
        />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to Luxcar
        </h1>
        <p className="text-gray-700 text-lg px-20">
          Fast, safe, and reliable Car rental Service.  
          Create an account to book your ride now!
        </p>
      </div>

      {/* Right Section (Form) */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition focus:ring-2 focus:ring-black"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-black outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-600 hover:text-black"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-2 border border-black rounded-lg focus:ring-2 focus:ring-black outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                  />
                  {file && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-contain mt-2"
                    />
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center justify-center"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/sign-in" className="text-black font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
