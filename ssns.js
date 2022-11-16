const validChecksums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
						"A", "B", "C", "D", "E", "F", "H", "J", "K", "L",
						"M", "N", "P", "R", "S", "T", "U", "V", "W", "X",
						"Y"];

function checkSSN() {
	let dob = document.getElementById("dob_checkvalidity").value;
	let identity = document.getElementById("identity_checkvalidity").value.toString().padStart(3, '0');
	let checksum = document.getElementById("checksum_checkvalidity").value;

	// Check that all fields are valid and validate SSN.
	if (validateDOB(dob) && validateIdentityNumber(identity) && validateChecksum(checksum) && validateSSN(dob, identity, checksum)) {
		
		// Determine correct symbol for SSN (-/A)
		let symbol = determineSymbol(dob);

		// Determine correct sex based on identity number (Male/Female)
		let sex = determineSex(identity);

		document.getElementById("SSN_CheckValidity").innerText = `Result: Valid SSN! - ${dob + symbol + identity + checksum} | Sex: ${sex}`
	} else {
		document.getElementById("SSN_CheckValidity").innerText = "Result: Invalid SSN!"
	}
}

function validateDOB(date) {
	if (date.length != 6) {
		alert("Invalid length for date of birth: " + date.length);
	} else {
		day = date.substring(0,2);
		month = date.substring(2,4);
		year = date.substring(4,6);

		if (isNaN(day) || day < 1 || day > 31) {
			alert("Invalid day in date of birth: " + day);
		} else if (isNaN(month) || month < 1 || month > 12) {
			alert("Invalid month in date of birth: " + month);
		} else if (isNaN(year) || year < 0) {
			alert("Invalid year in date of birth: " + year);
		} else {
			return true;
		}		
	}
	return false;
}

function validateIdentityNumber(identity) {
	num = identity;
	if (isNaN(num) || num < 2 || num > 899) {
		alert("Invalid identity number: " + num);
	} else {
		return true;
	}
	return false;
}

function validateChecksum(checksum) {
	if (!validChecksums.includes(checksum)) {
		alert("Invalid checksum character: " + checksum);
	} else {
		return true;
	}
	return false;
}

function validateSSN(dob, identity, checksum) {
	return checksum == calculateChecksum(dob, identity);
}

function bruteIdentity() {
	let dob = document.getElementById("dob_bruteidentity").value;
	let checksum = document.getElementById("checksum_bruteidentity").value;
	let sex = document.getElementById("sex_bruteidentity").value;

	if (validateDOB(dob) && validateChecksum(checksum)) {
		const validIdentities = [];

		for (let i = 2; i < 900; i++) {
			let identity = i.toString().padStart(3, '0');
			
			if (sex != "") {
				if (identity % 2 == 0 && sex == "F" && validateSSN(dob, identity, checksum)) {
					validIdentities.push(identity);
				} else if (identity % 2 == 1 && sex == "M" && validateSSN(dob, identity, checksum)) {
					validIdentities.push(identity);
				}
			} else {
				if (validateSSN(dob, identity, checksum)) {
					validIdentities.push(identity);
				}
			}
		}
		document.getElementById("SSN_BruteIdentity").innerText = `Result(s): ${validIdentities}`;
	} else {
		document.getElementById("SSN_BruteIdentity").innerText = "Failed to Bruteforce Identity Numbers!"
	}
}

function calculateChecksum(dob, identity) {
	let number = dob + identity;
	return validChecksums[Math.round(number / 31 % 1 * 31)];
}

function getChecksum() {
	let dob = document.getElementById("dob_calcchecksum").value;
	let identity = document.getElementById("identity_calcchecksum").value.toString().padStart(3, '0');

	if (validateDOB(dob) && validateIdentityNumber(identity)) {
		let checksum = calculateChecksum(dob, identity);
		let symbol = determineSymbol(dob);
		let sex = determineSex(identity);

		document.getElementById("SSN_CalcChecksum").innerText = `Result: ${dob + symbol + identity + checksum} | Sex: ${sex}`	
	}

}

function determineSymbol(dob) {
	let symbol = "";
	let currentYearFull = new Date().getFullYear();

	if (dob.substring(4,6) > currentYearFull.toString().substring(2,4)) {
		symbol = "-"
	} else {
		symbol = "A"
	}
	return symbol;
}

function determineSex(identity) {
	if (identity % 2 == 0) {
		sex = "Female"
	} else {
		sex = "Male"
	}
	return sex;
}

function bruteDobs() {
	let identity = document.getElementById("identity_brutedobs").value.toString().padStart(3, '0');
	let checksum = document.getElementById("checksum_brutedobs").value;
	let year = document.getElementById("year_brutedobs").value;

	const validDobs = [];

	if (validateIdentityNumber(identity) && validateChecksum(checksum)) {
		for (let month = 12; month > 0; month--) {
			// Day
			for (let day = 31; day > 0; day--) {
				let dob = `${day.toString().padStart(2, '0')}${month.toString().padStart(2, '0')}${year.toString().substring(2,4).padStart(2, '0')}`;
				if (calculateChecksum(dob, identity) == checksum) {
					validDobs.push(dob);
				}
			}
		}
		document.getElementById("SSN_BruteDobs").innerText = `Result(s): ${validDobs}`;
	} else {
		document.getElementById("SSN_BruteDobs").innerText = "Failed to Bruteforce Valid Date of Births!"
	}
}