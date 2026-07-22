import ClientProfileContent from "./ClientProfileContent";

export default function ProfilePage() {
  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 transition-colors duration-300">
      <ClientProfileContent />
    </div>
  );
}
