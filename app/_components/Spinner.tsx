import { useFormStatus } from "react-dom";
import Loading from "./Loading";

interface FormButtonProps {
    text: string;
}

export default function Spinner({text}: FormButtonProps){
    const { pending } = useFormStatus();

    return (
        <button 
            type="submit"
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800 text-lg cursor-pointer"
        >
            {
                pending 
                ? <Loading />
                : <span>{text}</span>
            }
        </button>
    )
}
