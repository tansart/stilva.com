export default function Greetings() {
	const hrs = (new Date()).getHours();

	if(hrs < 12) return "Good morning.";
	if(hrs < 17) return "Good afternoon.";
	return "Good evening."
}
