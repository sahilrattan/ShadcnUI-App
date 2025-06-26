import Card1 from "../components/Login"
import Card2 from "../components/Carousel"
import { ScrollAreaDemo } from "../components/ScrollArea"

const Home=()=>{

    return(
        <>
    <div className="flex flex-col md:flex-row flex-wrap gap-20 justify-center items-start p-4">

        <Card1/>
        <Card2/>
        <ScrollAreaDemo/>
                </div>

        </>
        
    )
}
export default Home;