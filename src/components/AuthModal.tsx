import React, { useState } from 'react';
import { UserAccount, Language } from '../types';
import { KIRATON_WARDS, KARIMGANJ_UNIONS } from '../data/initialData';
import {
  X,
  Lock,
  Mail,
  Phone,
  User,
  ShieldCheck,
  CheckCircle,
  KeyRound,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register' | 'forgot' | 'admin_login';
  lang: Language;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  allUsers: UserAccount[];
  onRegisterUser: (newUser: UserAccount) => void;
  onResetPassword: (phone: string, newPass: string) => boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  lang,
  onClose,
  onLoginSuccess,
  allUsers,
  onRegisterUser,
  onResetPassword,
}) => {
  if (!isOpen) return null;

  const isBn = lang === 'bn';
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'admin_login'>(initialMode);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [selectedWard, setSelectedWard] = useState(KIRATON_WARDS[2]);
  const [selectedUnion, setSelectedUnion] = useState(KARIMGANJ_UNIONS[0]);

  // Mobile OTP Verification State
  const [step, setStep] = useState<'form' | 'otp_verify'>('form');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Standard Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check user by phone or email + password
    const foundUser = allUsers.find(
      (u) =>
        (u.email.toLowerCase() === email.trim().toLowerCase() ||
          u.phone === email.trim()) &&
        u.password === password
    );

    if (foundUser) {
      // Update active login time
      const updatedUser: UserAccount = {
        ...foundUser,
        loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onLoginSuccess(updatedUser);
      onClose();
    } else {
      setErrorMessage(
        isBn
          ? 'ভুল ইমেইল/ফোন অথবা পাসওয়ার্ড! অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Invalid email/phone or password. Please try again.'
      );
    }
  };

  // Handle Admin Hidden Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Secret Admin Credentials check (alhasan375935@gmail.com / 371270)
    if (
      email.trim().toLowerCase() === 'alhasan375935@gmail.com' &&
      password.trim() === '371270'
    ) {
      const adminUser = allUsers.find((u) => u.email === 'alhasan375935@gmail.com') || {
        id: 'admin-01',
        name: 'আল হাসান (প্রধান এডমিন)',
        email: 'alhasan375935@gmail.com',
        phone: '01712371270',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        areaDivision: 'ঢাকা',
        areaDistrict: 'কিশোরগঞ্জ',
        areaUpazila: 'করিমগঞ্জ',
        areaUnion: '৩ নং কিরাটন ইউনিয়ন পরিষদ',
        areaWard: '৩ নং ওয়ার্ড',
        starRating: 7,
        isRegularCustomer: true,
        discountPercentage: 20,
        activeMinutes: 180,
        isVerified: true,
        createdAt: '2025-01-01',
      };
      onLoginSuccess(adminUser as UserAccount);
      onClose();
    } else {
      setErrorMessage(
        isBn
          ? 'এডমিন অথেনটিকেশন ব্যর্থ হয়েছে। সঠিক তথ্য প্রদান করুন।'
          : 'Admin authentication failed. Invalid credentials.'
      );
    }
  };

  // Start Registration & Send Mobile Phone OTP
  const handleStartRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone || phone.length < 11) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন।' : 'Please enter valid 11-digit phone number.');
      return;
    }

    // Check if phone or email already taken
    const existing = allUsers.find(
      (u) => u.phone === phone.trim() || (email && u.email.toLowerCase() === email.trim().toLowerCase())
    );
    if (existing) {
      setErrorMessage(isBn ? 'এই ফোন নাম্বার বা ইমেইল দিয়ে ইতিমধ্যে একাউন্ট রয়েছে।' : 'Account already exists with this phone or email.');
      return;
    }

    // Generate 6-digit verification code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setStep('otp_verify');
  };

  // Confirm Registration with Mobile OTP
  const handleVerifyOtpAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMessage(isBn ? 'ভুল ভেরিফিকেশন কোড! দয়া করে সঠিক কোডটি দিন।' : 'Incorrect verification code.');
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${phone.trim()}@mystoresite.com`,
      phone: phone.trim(),
      password: password,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      areaDivision: 'ঢাকা',
      areaDistrict: 'কিশোরগঞ্জ',
      areaUpazila: 'করিমগঞ্জ',
      areaUnion: selectedUnion,
      areaWard: selectedWard,
      starRating: 1,
      isRegularCustomer: false,
      discountPercentage: 5,
      activeMinutes: 1,
      isVerified: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRegisterUser(newUser);
    onLoginSuccess(newUser);
    onClose();
  };

  // Start Forgot Password Flow
  const handleStartForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const userFound = allUsers.find((u) => u.phone === phone.trim());
    if (!userFound) {
      setErrorMessage(isBn ? 'এই ফোন নাম্বারের কোনো একাউন্ট খুঁজে পাওয়া যায়নি।' : 'No account found with this phone number.');
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setStep('otp_verify');
  };

  // Confirm Password Reset with OTP
  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMessage(isBn ? 'ভুল ভেরিফিকেশন কোড।' : 'Incorrect code.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setErrorMessage(isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'Password must be at least 4 characters.');
      return;
    }

    const success = onResetPassword(phone.trim(), newPassword);
    if (success) {
      setSuccessMessage(isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে! এখন লগইন করুন।' : 'Password reset successful! Please log in.');
      setTimeout(() => {
        setStep('form');
        setMode('login');
        setSuccessMessage('');
      }, 1500);
    } else {
      setErrorMessage(isBn ? 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' : 'Failed to update password.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border-2 border-green-600/30 text-gray-950">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-800 via-green-900 to-red-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {mode === 'admin_login'
                  ? isBn
                    ? 'গোপন অ্যাডমিন ও স্টাফ প্রবেশদ্বার'
                    : 'Staff & Admin Portal'
                  : mode === 'register'
                  ? isBn
                    ? 'নতুন ইউজার একাউন্ট রেজিস্ট্রেশন'
                    : 'Customer Registration'
                  : mode === 'forgot'
                  ? isBn
                    ? 'মোবাইল ওটিপি পাসওয়ার্ড রিসেট'
                    : 'Phone OTP Password Reset'
                  : isBn
                  ? 'গ্রাহক লগইন (My Store Site)'
                  : 'Customer Sign In'}
              </h3>
              <p className="text-[11px] text-green-200">
                {isBn ? 'কিশোরগঞ্জ ও ৩ নং কিরাটন হাব' : 'Kishoreganj & Kiraton UP Hub'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* OTP Verification Step for Register or Forgot Password */}
          {step === 'otp_verify' ? (
            <form
              onSubmit={mode === 'forgot' ? handleConfirmResetPassword : handleVerifyOtpAndCreate}
              className="space-y-4"
            >
              <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl text-center space-y-2">
                <span className="text-xs font-bold text-green-900 block">
                  {isBn
                    ? `আপনার মোবাইল নাম্বারে (${phone}) ৬ ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে:`
                    : `6-digit verification code sent to ${phone}:`}
                </span>
                {/* Simulated SMS Alert Preview for effortless testing */}
                <div className="inline-block bg-white px-4 py-2 rounded-lg border border-green-300 shadow-sm">
                  <span className="text-xs text-gray-500 block font-sans">SMS Code (ওটিপি কোড):</span>
                  <span className="text-2xl font-black tracking-widest text-red-600 font-mono">
                    {generatedOtp}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'ভেরিফিকেশন কোড লিখুন *' : 'Enter 6-Digit Code *'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center text-xl tracking-widest font-mono p-2.5 border-2 border-green-600 rounded-xl focus:outline-none"
                />
              </div>

              {mode === 'forgot' && (
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isBn ? 'নতুন পাসওয়ার্ড লিখুন *' : 'Enter New Password *'}
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-green-600"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-1/3 py-2.5 rounded-xl border border-gray-300 text-xs font-semibold hover:bg-gray-50"
                >
                  {isBn ? 'পেছনে যান' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-green-600 hover:bg-green-700 text-white font-black py-2.5 rounded-xl text-xs sm:text-sm shadow-md"
                >
                  {isBn ? 'ভেরিফাই ও সম্পন্ন করুন (OK)' : 'Verify & Complete (OK)'}
                </button>
              </div>
            </form>
          ) : mode === 'register' ? (
            /* REGISTRATION FORM */
            <form onSubmit={handleStartRegistration} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'আপনার পূর্ণ নাম *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isBn ? 'যেমন: আরিফুল ইসলাম' : 'e.g. John Doe'}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'মোবাইল ফোন নাম্বার (ভেরিফিকেশন কোডের জন্য) *' : 'Mobile Phone (For Verification) *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' : 'Email Address (Optional)'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? '৩ নং কিরাটন ইউনিয়ন পরিষদের ওয়ার্ড নির্বাচন *' : 'Select Kiraton UP Ward *'}
                </label>
                <select
                  value={selectedWard}
                  onChange={(e) => setSelectedWard(e.target.value)}
                  className="w-full p-2 text-xs border border-gray-300 rounded-xl font-medium focus:ring-2 focus:ring-green-600"
                >
                  {KIRATON_WARDS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'গোপন পাসওয়ার্ড তৈরি করুন *' : 'Set Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isBn ? 'মোবাইলে কোড পাঠান ও একাউন্ট খুলুন' : 'Send Code & Open Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-600">
                  {isBn ? 'ইতিমধ্যে একাউন্ট আছে? ' : 'Already have an account? '}
                </span>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs font-bold text-green-700 hover:underline"
                >
                  {isBn ? 'এখানে লগইন করুন' : 'Sign In'}
                </button>
              </div>
            </form>
          ) : mode === 'forgot' ? (
            /* FORGOT PASSWORD FORM */
            <form onSubmit={handleStartForgot} className="space-y-4">
              <p className="text-xs text-gray-600">
                {isBn
                  ? 'আপনার একাউন্টের সাথে যুক্ত মোবাইল নাম্বারটি লিখুন। আমরা আপনাকে একটি ভেরিফিকেশন কোড পাঠাবো।'
                  : 'Enter your registered mobile number to receive a verification OTP code.'}
              </p>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'নিবন্ধিত মোবাইল ফোন নাম্বার *' : 'Registered Mobile Number *'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-2.5 rounded-xl text-xs sm:text-sm shadow-md"
              >
                {isBn ? 'ভেরিফিকেশন কোড পাঠান' : 'Send Verification OTP'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-gray-600 hover:underline"
                >
                  {isBn ? 'লগইনে ফিরে যান' : 'Back to Login'}
                </button>
              </div>
            </form>
          ) : mode === 'admin_login' ? (
            /* HIDDEN ADMIN / CONTROLLER LOGIN FORM */
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                  <span>{isBn ? 'শুধুমাত্র অনুমোদিত অ্যাডমিন ও স্টাফদের জন্য' : 'Authorized Personnel Only'}</span>
                </div>
                <p className="text-[11px] text-gray-600">
                  {isBn
                    ? 'নিরাপত্তা সুবিধার্থে আপনার নির্দিষ্ট প্রাতিষ্ঠানিক ইমেইল ও পাসওয়ার্ড প্রদান করুন।'
                    : 'Please enter designated staff credentials.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'অ্যাডমিন অফিসিয়াল ইমেইল *' : 'Admin Official Email *'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'সিকিউরিটি পাসওয়ার্ড *' : 'Security Password *'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-yellow-300" />
                <span>{isBn ? 'অ্যাডমিন প্যানেলে প্রবেশ করুন (OK)' : 'Access Admin Dashboard (OK)'}</span>
              </button>
            </form>
          ) : (
            /* STANDARD CUSTOMER LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  {isBn ? 'ইমেইল অথবা মোবাইল নাম্বার *' : 'Email or Phone Number *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="017xxxxxxxx বা email@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-800">
                    {isBn ? 'পাসওয়ার্ড *' : 'Password *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                    }}
                    className="text-[11px] font-semibold text-red-600 hover:underline"
                  >
                    {isBn ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{isBn ? 'লগইন করুন (OK)' : 'Sign In (OK)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-600">
                  {isBn ? 'নতুন গ্রাহক? ' : "Don't have an account? "}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  {isBn ? 'এখানে ফ্রি রেজিস্ট্রেশন করুন' : 'Create Free Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
