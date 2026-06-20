"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { PencilToLine, Person } from "@gravity-ui/icons";

const UpdateUserModal = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const imageFile = form.image.files[0];

    let imageUrl = "";

    try {
      // 1. If a file is selected, upload it to ImgBB
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        // Uses Next.js environment variable
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
        
        if (!apiKey) {
          throw new Error("ImgBB API key is missing from environment variables.");
        }

        const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });

        const imgbbData = await imgbbResponse.json();

        if (imgbbData.success) {
          imageUrl = imgbbData.data.url; // This is the direct link to the image
        } else {
          throw new Error(imgbbData.error?.message || "ImgBB upload failed");
        }
      }

      // 2. Pass the public image URL to authClient (updates MongoDB)
      await authClient.updateUser({
        name,
        ...(imageUrl && { image: imageUrl }), // Only updates image if a new one was uploaded
      });

      form.reset();
      document.getElementById("update_user_modal").close();
    } catch (error) {
      console.error("Update failed:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Open Modal Button */}
      <button
        className="w-full py-3 px-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-md cursor-pointer flex justify-center items-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-500"
        onClick={() =>
          document.getElementById("update_user_modal").showModal()
        }
      >
        <PencilToLine className="w-5 h-5" />
        Update Profile
      </button>

      {/* DaisyUI Modal */}
      <dialog id="update_user_modal" className="modal">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="modal-box max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-blue-500/20 text-slate-800 dark:text-white shadow-2xl p-6 sm:p-8">
            
            {/* Close Button */}
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-white">
                ✕
              </button>
            </form>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-full">
                <Person className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-extrabold text-2xl tracking-tight">
                Update Profile
              </h3>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="text-slate-700 dark:text-blue-200/90 text-sm font-semibold tracking-wide mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-blue-100 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                  required
                />
              </div>

              {/* File Upload for Image */}
              <div>
                <label className="text-slate-700 dark:text-blue-200/90 text-sm font-semibold tracking-wide mb-1.5 block">
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-blue-100 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-950 dark:file:text-blue-400 hover:file:bg-blue-100 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  className="py-2.5 px-5 rounded-xl font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                  onClick={() =>
                    document.getElementById("update_user_modal").close()
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default UpdateUserModal;