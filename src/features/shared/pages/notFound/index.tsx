import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    return (
        <div className="absolute inset-0 grid place-content-center p-0 m-0">
            <div className="text-center">
                <h1 className="font-display text-7xl font-semibold tracking-wide text-balance text-foreground sm:text-8xl">404</h1>
                <p className="mt-4 font-display text-2xl font-semibold tracking-wide text-foreground">Página no encontrada</p>
                <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-[color-mix(in_oklch,var(--primary)_92%,black)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
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
