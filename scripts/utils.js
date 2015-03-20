function hasClass(element, className)
{
	var classNames = element.className.split(' ');
	for (var c = 0; c < classNames.length; c++ ) {
		if (classNames[c] == className) {
			return true;
		}
	}
	return false;
}