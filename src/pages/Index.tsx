import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/SessionContextProvider";

const Index = () => {
  const { session, isLoading } = useSession();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo à Tesouraria da Igreja</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Gerencie dízimos, ofertas, votos e despesas de forma simples e organizada.
        </p>
        {!isLoading && (
          session ? (
            <Link to="/treasury">
              <Button className="px-6 py-3 text-lg">Ir para o Painel da Tesouraria</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="px-6 py-3 text-lg">Entrar para Gerenciar</Button>
            </Link>
          )
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;