import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <div className="absolute inset-0 grid place-content-center p-0 m-0">
            <div className="text-center">
                <h1 className="text-5xl font-semibold tracking-tight text-balance text-foreground sm:text-7xl">🤷</h1>
                <p className="mt-4 text-base font-semibold text-foreground">404</p>
                <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="rounded-md bg-foreground px-3.5 py-2.5 text-sm font-semibold text-background shadow-xs  hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                        Volver al inicio
                    </Link>
                    <Link to="#" className="text-sm font-semibold text-foreground hover:opacity-80">
                        Contactar al soporte <span aria-hidden="true">&rarr;</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
