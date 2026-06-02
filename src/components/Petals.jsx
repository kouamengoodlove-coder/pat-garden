export default function Petals() {

  const petals = Array.from({ length: 25 });

  return (

    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      {petals.map((_, index) => (

        <div
          key={index}
          className="petal"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
            width: `${10 + Math.random() * 10}px`,
            height: `${10 + Math.random() * 10}px`,
          }}
        />

      ))}

    </div>
  );
}