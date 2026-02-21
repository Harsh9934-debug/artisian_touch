import { SignUp } from "@clerk/clerk-react";

function AuthRegister() {
  return (
    <div className="flex justify-center items-center w-full">
      <SignUp path="/auth/register" routing="path" signInUrl="/auth/login" />
    </div>
  );
}

export default AuthRegister;
