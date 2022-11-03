import { FcLike, FcLikePlaceholder } from "react-icons/fc";

type HealthProps = {
  isGameOver: boolean;
  health: number;
  maxHealth: number;
}

const Health = ({
  isGameOver,
  health,
  maxHealth
}: HealthProps) => {
  return (
    < div className="flex items-center mt-4" >
      {
        !isGameOver
          ?
          <>
            <span className="mr-2">Health:</span>
            <Hearts count={health} type={HeartType.Full} />
            <Hearts count={maxHealth - health} type={HeartType.Empty} />
          </>
          : <h1 className="text-red-600 text-lg font-bold">Game Over</h1>
      }
    </div >
  );
};

export default Health;

enum HeartType {
  Full,
  Empty
}

type HeartsProps = {
  count: number;
  type: HeartType;
}

const Hearts = ({
  count,
  type
}: HeartsProps) => {
  return (
    <>
      {
        [...Array(count)].map(heart => (
          type === HeartType.Full
            ? <FcLike key={heart} />
            : <FcLikePlaceholder key={heart} />
        ))
      }
    </>
  );
};
