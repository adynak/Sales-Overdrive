function randomInterval(min,max)
{
	var someNumber;
    someNumber = Math.floor(Math.random()*(max-min+1)+min);
    return someNumber.toString();
}