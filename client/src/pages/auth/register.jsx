import { SignUp } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

function AuthRegister() {
  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create Account</h1>
        <p className="text-muted-foreground">Join Artisan Touch to start your creative journey.</p>
      </motion.div>
      <motion.div variants={itemVariants} className="flex justify-center items-center w-full">
        <SignUp
          path="/auth/register"
          routing="path"
          signInUrl="/auth/login"
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-black hover:bg-gray-800 text-sm normal-case",
              card: "shadow-none border-none bg-transparent",
              headerTitle: "hidden",
              socialButtonsBlockButton: "border-gray-200 hover:bg-gray-50",
              footerAction: "hidden"
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default AuthRegister;

