export default function UnauthorizedPage() {
  return (
    <div className="text-center p-10 min-h-screen">
      <h1 className="text-4xl md:text-5xl mt-20 font-bold text-red-600">
        Accesso negato
      </h1>
      <p className="mt-4 text-gray-600">
        Non hai i permessi per accedere a questa pagina.
      </p>
    </div>
  )
}
