import {
    AlertDialog as AlertDialogUI,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface AlertDialogDemoProps {
    triggerText?: string;
    title?: string;
    description?: string;
    actionText?: string;
    cancelText?: string;
    onAction?: () => void;
    onCancel?: () => void;
}

export function CommonAlertDialog(props: AlertDialogDemoProps) {
    return (
        <AlertDialogUI>
            <AlertDialogTrigger asChild>
                <Button variant="outline">{props.triggerText}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{props.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {props.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={props.onCancel}>{props.cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={props.onAction}>{props.actionText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogUI>
    )
}
