"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, updateEmail, updatePassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, UserProfile, updateUserPhoto, updateProfileDetails } from "@/lib/db";
import Navbar from "@/components/Navbar";
import CyberBackground from "@/components/cyberbackground";
import { 
  User as UserIcon, 
  Shield, 
  Key, 
  Loader2, 
  ArrowLeft,
  Award,
  CheckCircle2,
  Lock
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const uProfile = await getUserProfile(user.uid);
          setProfile(uProfile);
        } catch (err) {
          console.error("Failed to load user profile", err);
        } finally {
          setLoading(false);
        }
      } else {
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert("Image is too large. Please choose an image smaller than 1MB.");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      if (base64 && profile) {
        try {
          await updateUserPhoto(profile.uid, base64);
          setProfile(prev => prev ? { ...prev, photoURL: base64 } : null);
          window.dispatchEvent(new Event("profileUpdated"));
        } catch (err) {
          console.error("Failed to update profile photo", err);
          alert("Error updating profile photo. Please try again.");
        } finally {
          setUploading(false);
        }
      }
    };
    reader.onerror = () => {
      setUploading(false);
      alert("Failed to read file.");
    };
    reader.readAsDataURL(file);
  };

  // Inline editing states
  const [editingField, setEditingField] = useState<"username" | "email" | "password" | null>(null);
  const [tempUsername, setTempUsername] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [tempConfirmPassword, setTempConfirmPassword] = useState("");
  const [inRowFeedback, setInRowFeedback] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" });
  const [actionLoading, setActionLoading] = useState(false);

  const saveUsernameInline = async () => {
    if (!auth.currentUser || !profile) return;
    if (!tempUsername.trim()) {
      setInRowFeedback({ type: "error", message: "FIELDS_CANNOT_BE_EMPTY" });
      return;
    }

    setActionLoading(true);
    setInRowFeedback({ type: "idle", message: "" });

    try {
      if (tempUsername !== profile.username) {
        await updateProfileDetails(profile.uid, tempUsername, profile.email);
        window.dispatchEvent(new Event("profileUpdated"));
        setProfile(prev => prev ? { ...prev, username: tempUsername } : null);
        setInRowFeedback({ type: "success", message: "USERNAME_SYNCHRONIZED_SUCCESSFULLY" });
      }
      setEditingField(null);
    } catch (err: any) {
      console.error(err);
      setInRowFeedback({ type: "error", message: err.message || "SYNC_TRANSLATION_FAILURE" });
    } finally {
      setActionLoading(false);
    }
  };

  const saveEmailInline = async () => {
    if (!auth.currentUser || !profile) return;
    if (!tempEmail.trim()) {
      setInRowFeedback({ type: "error", message: "FIELDS_CANNOT_BE_EMPTY" });
      return;
    }

    setActionLoading(true);
    setInRowFeedback({ type: "idle", message: "" });

    try {
      if (tempEmail.toLowerCase() !== profile.email.toLowerCase()) {
        await updateEmail(auth.currentUser, tempEmail);
        await updateProfileDetails(profile.uid, profile.username, tempEmail);
        window.dispatchEvent(new Event("profileUpdated"));
        setProfile(prev => prev ? { ...prev, email: tempEmail } : null);
        setInRowFeedback({ type: "success", message: "EMAIL_SYNCHRONIZED_SUCCESSFULLY" });
      }
      setEditingField(null);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        setInRowFeedback({ 
          type: "error", 
          message: "RE-AUTHENTICATION_REQUIRED. Please sign out and sign in again to modify credentials." 
        });
      } else {
        setInRowFeedback({ type: "error", message: err.message || "SYNC_TRANSLATION_FAILURE" });
      }
    } finally {
      setActionLoading(false);
    }
  };

  const savePasswordInline = async () => {
    if (!auth.currentUser || !profile) return;
    if (!tempPassword) {
      setInRowFeedback({ type: "error", message: "PASSWORD_CANNOT_BE_EMPTY" });
      return;
    }
    if (tempPassword.length < 6) {
      setInRowFeedback({ type: "error", message: "PASSWORD_MUST_BE_AT_LEAST_6_CHARACTERS" });
      return;
    }
    if (tempPassword !== tempConfirmPassword) {
      setInRowFeedback({ type: "error", message: "PASSWORDS_DO_NOT_MATCH" });
      return;
    }

    setActionLoading(true);
    setInRowFeedback({ type: "idle", message: "" });

    try {
      await updatePassword(auth.currentUser, tempPassword);
      setInRowFeedback({ type: "success", message: "PASSWORD_HASH_ROTATED_SUCCESSFULLY" });
      setEditingField(null);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/requires-recent-login") {
        setInRowFeedback({ 
          type: "error", 
          message: "RE-AUTHENTICATION_REQUIRED. Please sign out and sign in again to rotate password hashes." 
        });
      } else {
        setInRowFeedback({ type: "error", message: err.message || "DECRYPTION_HASH_FAILURE" });
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <CyberBackground />
        <div className="min-h-[calc(100vh-90px)] flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-green-400 h-10 w-10" />
            <p className="text-green-300 font-mono tracking-widest text-xs animate-pulse">
              Loading profile...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!profile) return null;

  return (
    <>
      <Navbar />
      <CyberBackground />

      <main className="min-h-screen px-6 py-28 text-white relative z-10 max-w-5xl mx-auto w-full space-y-8">
        
        {/* BACK TO HUD COMMAND */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-green-400 transition-colors border border-white/5 bg-white/[0.01] hover:border-green-500/20 px-4 py-2 rounded-xl"
          >
            <ArrowLeft size={12} />
            <span>Return to Dashboard</span>
          </Link>

          <span className="text-[10px] text-green-500 font-mono tracking-widest uppercase hidden sm:inline">
            // Profile Settings Loaded
          </span>
        </div>

        {/* PROFILE DOSSIER PANEL */}
        <div className="glass-card p-8 relative overflow-hidden group hover:border-green-500/20 transition-all duration-300 shadow-2xl shadow-black/85">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-green-400/30 to-blue-500/20" />
          
          {/* Corner Crosshairs */}
          <div className="absolute top-3 left-3 text-white/10 font-mono text-[9px] pointer-events-none select-none">+</div>
          <div className="absolute bottom-3 right-3 text-white/10 font-mono text-[9px] pointer-events-none select-none">+</div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-6 mb-6">
            <div className="flex items-center gap-4">
              {/* PROFILE PICTURE AVATAR TRIGGER */}
              <div className="relative group shrink-0">
                <div 
                  onClick={() => document.getElementById("avatar-upload-input")?.click()}
                  className="w-16 h-16 rounded-full border border-green-500/30 bg-green-500/5 hover:bg-green-500/15 hover:border-green-400/60 shadow-[0_0_12px_rgba(74,222,128,0.15)] hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all duration-300 cursor-pointer flex items-center justify-center text-green-400 font-mono font-bold text-2xl select-none overflow-hidden relative"
                >
                  {uploading ? (
                    <Loader2 className="animate-spin text-green-400 h-6 w-6" />
                  ) : profile.photoURL ? (
                    <img src={profile.photoURL} alt="Profile" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    (profile.username || "user").charAt(0).toUpperCase()
                  )}
                  
                  {/* Upload Overlay */}
                  {!uploading && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300 text-[8px] font-mono tracking-widest text-green-400 font-bold uppercase">
                      UPLOAD
                    </div>
                  )}
                </div>
                <input
                  id="avatar-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <h1 className="text-3xl font-black text-white font-mono uppercase tracking-wide flex items-center gap-2">
                  <UserIcon className="text-green-400" size={26} />
                  User Profile
                </h1>
                <span className="text-[9px] text-gray-500 font-mono tracking-widest block mt-1 uppercase">
                  Account Details & Settings
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3.5 py-1.5 rounded-xl text-green-400 font-mono text-xs uppercase tracking-wider font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              Verified Account
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 font-mono text-sm">
            {/* LEFT PROFILE PARAMETERS (WITH INLINE EDITING) */}
            <div className="space-y-4">
              {/* Username Row */}
              <div className="flex flex-col border-b border-white/5 pb-2.5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs">Username</span>
                  {editingField !== "username" && (
                    <button
                      onClick={() => {
                        setEditingField("username");
                        setTempUsername(profile.username);
                        setInRowFeedback({ type: "idle", message: "" });
                      }}
                      className="text-[10px] font-mono text-green-400 hover:text-green-300 hover:underline cursor-pointer bg-transparent border-none p-0 uppercase"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {editingField === "username" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="bg-black/55 border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-green-500 w-full"
                    />
                    <button
                      onClick={saveUsernameInline}
                      disabled={actionLoading}
                      className="text-xs font-mono text-green-400 hover:text-green-300 cursor-pointer bg-transparent border-none font-bold"
                    >
                      {actionLoading ? "..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      disabled={actionLoading}
                      className="text-xs font-mono text-gray-500 hover:text-gray-400 cursor-pointer bg-transparent border-none"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span className="text-white font-bold">{profile.username}</span>
                )}
              </div>

              {/* Email Row */}
              <div className="flex flex-col border-b border-white/5 pb-2.5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs">Email Address</span>
                  {editingField !== "email" && (
                    <button
                      onClick={() => {
                        setEditingField("email");
                        setTempEmail(profile.email);
                        setInRowFeedback({ type: "idle", message: "" });
                      }}
                      className="text-[10px] font-mono text-green-400 hover:text-green-300 hover:underline cursor-pointer bg-transparent border-none p-0 uppercase"
                    >
                      Edit
                    </button>
                  )}
                </div>
                {editingField === "email" ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="bg-black/55 border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-green-500 w-full"
                    />
                    <button
                      onClick={saveEmailInline}
                      disabled={actionLoading}
                      className="text-xs font-mono text-green-400 hover:text-green-300 cursor-pointer bg-transparent border-none font-bold"
                    >
                      {actionLoading ? "..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      disabled={actionLoading}
                      className="text-xs font-mono text-gray-500 hover:text-gray-400 cursor-pointer bg-transparent border-none"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <span className="text-white font-bold">{profile.email}</span>
                )}
              </div>

              {/* Password Row */}
              <div className="flex flex-col border-b border-white/5 pb-2.5 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 uppercase text-xs">Password</span>
                  {editingField !== "password" && (
                    <button
                      onClick={() => {
                        setEditingField("password");
                        setTempPassword("");
                        setTempConfirmPassword("");
                        setInRowFeedback({ type: "idle", message: "" });
                      }}
                      className="text-[10px] font-mono text-green-400 hover:text-green-300 hover:underline cursor-pointer bg-transparent border-none p-0 uppercase"
                    >
                      Change
                    </button>
                  )}
                </div>
                {editingField === "password" ? (
                  <div className="space-y-2 mt-1 w-full">
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        placeholder="New Password"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        className="bg-black/55 border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-green-500 w-full"
                      />
                      <input
                        type="password"
                        placeholder="Confirm"
                        value={tempConfirmPassword}
                        onChange={(e) => setTempConfirmPassword(e.target.value)}
                        className="bg-black/55 border border-white/10 rounded px-2.5 py-1 text-xs font-mono text-white focus:outline-none focus:border-green-500 w-full"
                      />
                    </div>
                    <div className="flex justify-end gap-3 text-[10px] font-mono">
                      <button
                        onClick={savePasswordInline}
                        disabled={actionLoading}
                        className="text-green-400 hover:text-green-300 cursor-pointer bg-transparent border-none font-bold uppercase"
                      >
                        {actionLoading ? "Saving..." : "Confirm"}
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        disabled={actionLoading}
                        className="text-gray-500 hover:text-gray-400 cursor-pointer bg-transparent border-none uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500 italic">••••••••</span>
                )}
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-gray-400 uppercase text-xs">Account Role</span>
                <span className="text-green-400 font-bold uppercase">
                  {profile.role === "admin" ? "Admin" : "Standard User"}
                </span>
              </div>
            </div>

            {/* RIGHT TELEMETRY INDICES */}
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-gray-400 uppercase text-xs">User ID</span>
                <span className="text-gray-300 font-mono text-xs truncate max-w-[200px]" title={profile.uid}>
                  {profile.uid}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-gray-400 uppercase text-xs">Account Created</span>
                <span className="text-white font-semibold">
                  {new Date(profile.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-gray-400 uppercase text-xs">Quizzes Completed</span>
                <span className="text-white font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-blue-400" />
                  {profile.stats.quizCount}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-gray-400 uppercase text-xs">Highest Score</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Award size={12} className="text-cyan-400" />
                  {profile.stats.highestScore} / 10
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-gray-400 uppercase text-xs">Average Score</span>
                <span className="text-green-400 font-bold flex items-center gap-1">
                  <Shield size={12} className="text-green-400" />
                  {profile.stats.averageScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Feedback alerts container */}
          {inRowFeedback.message && (
            <div className={`mt-6 p-3 rounded-xl border text-[10px] font-mono uppercase tracking-wider font-bold ${
              inRowFeedback.type === "success" 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}>
              {inRowFeedback.type === "success" ? "✓" : "⚠"} {inRowFeedback.message}
            </div>
          )}
        </div>

      </main>
    </>
  );
}
