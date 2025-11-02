// import { useFormStatus } from "react-dom";
import Loading from "./Loading";

interface FormButtonProps {
    text: string;
    loading: boolean;
}

export default function Spinner({text, loading}: FormButtonProps){
    // const { pending } = useFormStatus();

    return (
        <button 
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white p-2 rounded hover:bg-green-800 text-lg cursor-pointer"
        >
            {
                loading 
                ? <Loading />
                : <span>{text}</span>
            }
        </button>
    )
}
