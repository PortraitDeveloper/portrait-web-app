/* eslint-disable @next/next/no-img-element */
export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div>
          <div className="animate-spin mb-4">
            <img
              src="/loadingCircle.png"
              alt="loading circle"
              width="75px"
              heigh="50px"
            />
          </div>
          <text className="text-center font-bold">Loading...</text>
        </div>
      </div>
    </>
  );
}
