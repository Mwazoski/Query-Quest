import Header from "@/components/ui/header";
import { PlaygroundTerminal } from "@/components/ui/PlaygroundTerminal";

export default function Playground() {
    return (
        <>
            <Header />
            <div className="container" >
                <PlaygroundTerminal />
            </div>
        </>
    );  
}
