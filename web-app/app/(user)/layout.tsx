import { PropsWithChildren } from "react";

import { getCurrentUser } from "./actions/getCurrentUser";
import Navbar from "../components/layout/Navbar";
import FooterSection from "../components/layout/FooterSection";

export default async function LayoutUserPage({ children }: PropsWithChildren) {
  const user = await getCurrentUser();
  return (
    <div>
      <Navbar user={user}></Navbar>
      {children}
      <FooterSection></FooterSection>
    </div>
  );
}
