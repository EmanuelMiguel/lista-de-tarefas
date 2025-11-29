import { Trash } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { Button } from "./ui/button";

type ClearTaskProps = {
  clearCompletedTasks: () => void;
};

const ClearTask = ({clearCompletedTasks}: ClearTaskProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="text-xs h-7 cursor-pointer" variant="outline">
          <Trash />
          Limpar tarefas concluídas
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Tem certeza que deseajar excluir x itens?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="cursor-pointer" onClick={clearCompletedTasks}>Sim</AlertDialogAction>
          <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClearTask;
