import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import CategoryList from "./_components/CategoryList";
import GlobalApi from "./_utils/GlobalApi";
import BusinessList from "./_components/BusinessList";
import Footer from "./_components/Footer";


export default function Home() {

 
  return (
    <div>
        <CategoryList/>

        <BusinessList/>
        {/* <BusinessList/> */}
        <br />
        

    </div>
  );
}
