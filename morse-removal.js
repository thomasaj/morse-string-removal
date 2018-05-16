var getTotalDeletionPaths = (given, remove) => {
    /// <summary> 
    /// Get count of possible unique strings produced by removing a given Morse code string
    /// consisting of the characters '*', '-', and '_' (dot, dash, and space) from another.
    /// The remove string does not need to occur as a contiguous substring in the given string;
    /// it can be removed character by character as long as they occur in the correct order in
    /// the given string.
    /// </summary>
    /// <param name="given" type="String">Initial Morse code string to remove from</param>
    /// <param name="remove" type="String>Morse code string to remove from the given string</param>
    /// <returns type="Number">Integer count of possible result strings produced after removing</returns>

	// dynamic array containing data objects that record every deletion state
	var variants = 
	[
		{
			deletions: [],      // indices where characters may be removed
			remaining: given,   // remaining substring from given to delete from
			start:     0        // absolute position in given string to continue removing from
		}
	];

	var removeArr = remove.split('');
	for (var i = 0; i < removeArr.length; i++) {
		var charToRemove = removeArr[i];
        
		// get all variants from where we have the current number of deletions
		var variantsToCheck = variants.filter((variant) => return variant.deletions.length === i);

		for (var j = 0; j < variantsToCheck.length; j++) {
			var curVariant = variantsToCheck[j];

			// get the indices of the current character, but filter if the given index is outside of the absolute bounds of the given string
			var indices = getIndices(curVariant.remaining, charToRemove).filter((index) => index <= given.length - remove.length);
			for (var k = 0; k < indices.length; k++)
			{
				var deletion = curVariant.start + indices[k]; // deletion at absolute position in given string
				variants.push(
				{
					deletions: curVariant.deletions.concat(deletion),
					remaining: given.slice(deletion + 1),
					start:     deletion + 1,
				});
			}
		}
	}

	// get all recorded variants that have completed all deletions
	var completeVariants = variants.filter((variant) => variant.deletions.length === remove.length);

	// apply deletions to get full list of result strings
	var resultStrings = completeVariants.map((variant) => removeIndices(given, variant.deletions));

	// filter out duplicates. sort to ensure duplicates are adjacent for linear filtering
	var uniqueResultStrings = resultStrings.sort().filter((item, i, arr) => !i || item !== arr[i-1]);

	return uniqueResultStrings.length;
}

var getIndices = function (string, char)
{
    /// <summary>Find all instances of given character in string and return array of indices</summary>
    /// <param name="string" type="String">String to check for given character</param>
    /// <param name="char" type="String">Character to search string for</param>
    /// <returns type="Array" elementType="Number">Array of indices where character appears in string</returns>
    
	var indices = [];
	for (var i = 0; i < string.length; i++) {
		if (string[i] === char) {
			indices.push(i);
		}
	}
	return indices;
}

// removes characters at specified indices from string
var removeIndices = (string, indices) => {
    /// <summary>Remove given indices from a string</summary>
    /// <param name="string" type="String">String to remove indices from</param>
    /// <param name="indices" type="Array" elementType="Number">Array of indices to remove from string</param>
    /// <returns type="String">Input string with given indices removed</returns>
    
	var result = '';
	for (var i = 0; i < string.length; i++) {
		if (i === indices[0]) {
			result += 'X'; // mark index in result string for easy removal
			indices.splice(0, 1);
		} 
		else {
			result += string[i];
		}
	}

	return result.replace(/X/g, '');
}
