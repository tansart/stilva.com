export default function PreviousLocationFactory() {
	let previousLocation = null;
	let returnedComponent = null;

	return function PreviousLocation({location, children}) {
		returnedComponent = children({location, previousLocation});
		previousLocation = location;
		return returnedComponent;
	}
}
