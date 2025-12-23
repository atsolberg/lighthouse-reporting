import colors from 'tailwindcss/colors';
import { gradeScore, Grade } from '~/utils';

const ScoreCircle = ({ score }) => {
  const roundedScore = Math.round(score);
  const circumference = 2 * Math.PI * 45;
  const progress = (roundedScore / 100) * circumference;
  const grade = gradeScore(roundedScore);

  const getFillColor = () => {
    if (grade === Grade.Bad) return colors.red[100];
    if (grade === Grade.Ok) return colors.orange[100];
    return colors.green[100];
  };

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r="45"
        fill={getFillColor()}
        stroke={grade.color}
        strokeWidth="10"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        transform="rotate(-90 60 60)"
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="28"
        fill={grade.color}
      >
        {Math.round(roundedScore)}
      </text>
    </svg>
  );
};

export default ScoreCircle;
