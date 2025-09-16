import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erro 404: O usuário tentou acessar uma rota inexistente:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Ops! Página não encontrada
        </p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Voltar para o Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;