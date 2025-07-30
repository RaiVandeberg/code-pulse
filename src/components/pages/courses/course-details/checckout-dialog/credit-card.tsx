import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form/primitives"
import { ArrowLeft, ArrowRight } from "lucide-react"

export const CreditCardForm = () => {

    return (
        <Form>
            <form className="flex flex-col">
                <div className="flex items-center gap-4 flex-col">
                    <div>
                        <p>PREVIEW</p>
                    </div>
                    <div className="w-full grid sm:grid-cols-2 gap-2 flex-1/2">
                        <p>inputs</p>
                    </div>

                </div>

                <div className="flex items-center justify-between mt-6">
                    <Button variant={"outline"}>
                        <ArrowLeft />
                        Voltar
                    </Button>

                    <Button type="submit">
                        Confirmar
                        <ArrowRight />
                    </Button>
                </div>
            </form>
        </Form>
    )
}