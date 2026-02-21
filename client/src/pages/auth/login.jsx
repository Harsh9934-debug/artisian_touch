import { SignIn } from "@clerk/clerk-react";

function AuthLogin() {
  return (
    <div className="flex justify-center items-center w-full">
      <SignIn path="/auth/login" routing="path" signUpUrl="/auth/register" />
    </div>
  );
}

export default AuthLogin;
