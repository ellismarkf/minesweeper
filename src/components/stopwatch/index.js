function greaterThan0(num) {
  return num > 0;
}

function lessThan10(num) {
  return num < 10;
}

function shouldDisplay(num) {
  return greaterThan0(num) && lessThan10(num);
}

export default function Stopwatch({ seconds }) {
  const tensValue = Math.floor(seconds / 10);
  const hundredsValue = Math.floor(seconds / 100);
  const ones = seconds % 10;
  const tens = shouldDisplay(tensValue) ? tensValue : 0;
  const hundreds = shouldDisplay(hundredsValue) ? hundredsValue : 0;
  return (
    <div>
      <span>⏱&nbsp;</span>
      <span>{hundreds}{tens}{ones}</span>
    </div>
  );
}
