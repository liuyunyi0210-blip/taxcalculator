let $applyMoney, $discountMoney, $secondGenerationHealthyMoney, $wholeDiscountMoney, $actualPayMoney = null;
let $personalOption;
let $companyOption;
let $personalTicket, $companyTicket = null;

let applyMoney = 0;
let includingTax = true;
const discountRate = 0.1;
const secondGenerationHealthyMoneyRate = 0.0211;

function resetWholeTickets(){
	['rent-sale', 'rent-tax', 'rent-total'].forEach( domId => {
		const $textItem = document.getElementById(`${domId}-price`);
		$textItem.textContent = "$0";
	})

	$applyMoney.textContent = "$0";
	$discountMoney.textContent = "$0";
	$secondGenerationHealthyMoney.textContent = "$0";
	$wholeDiscountMoney.textContent = "$0";
	$actualPayMoney.textContent = "$0";
}

const toggleVisibility = (element, show) => {
    element.classList.toggle("d-block", show);
    element.classList.toggle("d-none", !show);
}

function resetTicket() {
    const isPersonal = $personalOption.checked;
    toggleVisibility($personalTicket, isPersonal);
    toggleVisibility($companyTicket, !isPersonal);
}

function findHouseOwner(){
	return $personalOption.checked ? "personal" : "company";
}

function setCompanyRentineFee(sale, tax, total){
	const values = { sale, tax, total };

	['rent-sale', 'rent-tax', 'rent-total'].forEach( domId => {
		const $textItem = document.getElementById(`${domId}-price`);
		$textItem.textContent = `$${values[domId.replace('rent-', '')].toLocaleString()}`;
	})
}

function updateRentingFee(event = null){
	const whoIsHouseOwner = findHouseOwner();
	let discountMoney = 0;
	let secondGenerationHealthyMoney = 0;
	let actualPayMoney = 0;
	let wholeDiscountMoney = 0;

	let eventTargetValue = parseInt(event ? event.target.value : document.getElementById('monthly-renting-fee').value);
	if (isNaN(eventTargetValue)) {
		resetWholeTickets();
		return;
	}
	let applyMoney = Math.max(eventTargetValue, 0);

	let displayMoney = parseInt(eventTargetValue < 0 ? 0 : eventTargetValue);
	document.getElementById('monthly-renting-fee').value = displayMoney;

	let taxFee;
	if (whoIsHouseOwner === 'company') {
		if (!includingTax) {
			// 未含稅：applyMoney 是銷售額，需要計算稅額和總金額
			taxFee = Math.round(applyMoney * 0.05);
			actualPayMoney = applyMoney + taxFee;
			setCompanyRentineFee(applyMoney, taxFee, actualPayMoney);
		} else {
			// 含稅：applyMoney 是總金額，需要計算銷售額和稅額
			actualPayMoney = applyMoney;
			taxFee = Math.round(applyMoney / 1.05 * 0.05);
			let saleAmount = applyMoney - taxFee;
			setCompanyRentineFee(saleAmount, taxFee, actualPayMoney);
		}
		return;
	}

	let wholeRate = 0;
	if (applyMoney < 17587) {
		actualPayMoney = displayMoney;
	} else {
		if (!includingTax) {
			wholeRate += (secondGenerationHealthyMoneyRate + discountRate);
		} else {
			if (applyMoney >= 20010) {
				wholeRate += secondGenerationHealthyMoneyRate;
				wholeRate += discountRate;
			} else if (applyMoney >= 20000 && applyMoney < 20010) {
				wholeRate += secondGenerationHealthyMoneyRate;
			}
		}
	}

	const needsCalculation = includingTax ? applyMoney >= 20000 : applyMoney >= 17587;
	if (!needsCalculation) {
	    actualPayMoney = applyMoney;
	} else {
		displayMoney = includingTax ? applyMoney : Math.round(applyMoney / 0.8789);
		discountMoney = (includingTax && applyMoney >= 20010) || !includingTax
			? displayMoney * discountRate
			: 0;
		secondGenerationHealthyMoney = (includingTax && applyMoney >= 20000) || !includingTax 
		    ? displayMoney * secondGenerationHealthyMoneyRate 
		    : 0;

		wholeDiscountMoney = !includingTax
			? Math.round(discountMoney) + Math.round(secondGenerationHealthyMoney)
			: displayMoney * wholeRate;
		actualPayMoney = !includingTax ? applyMoney : displayMoney * (1 - wholeRate);
	}
	const updateElementText = (element, value) => element.textContent = `$${Math.round(value).toLocaleString()}`;
	updateElementText($applyMoney, displayMoney);
	updateElementText($discountMoney, discountMoney);
	updateElementText($secondGenerationHealthyMoney, secondGenerationHealthyMoney);
	updateElementText($wholeDiscountMoney, wholeDiscountMoney);
	updateElementText($actualPayMoney, actualPayMoney);
}

(function(){
	$personalOption = document.getElementById("personal-landlord");
 	$companyOption = document.getElementById("company-landlord");
 	$personalOption.addEventListener("change", () => { resetTicket() });
 	$companyOption.addEventListener("change", () => { resetTicket() });

 	$personalTicket = document.getElementById("personal-landlord-ticket");
 	$companyTicket = document.getElementById("company-landlord-ticket");

	$applyMoney = document.getElementById('actual-apply-money');
	$discountMoney = document.getElementById('discount-money');
	$secondGenerationHealthyMoney = document.getElementById('second-generation-healthy');
	$wholeDiscountMoney = document.getElementById('whole-discount-money');
	$actualPayMoney = document.getElementById('actual-pay-money');

	const $taxTypes = document.querySelectorAll('[name="tax-policy"]');
	$taxTypes.forEach(($taxType) => {
	    $taxType.addEventListener('change', (e) => {
	    	includingTax = e.target.value === 'including' ? true : false;
	    	updateRentingFee();

	    });
	});

	const $landLordTypes = document.querySelectorAll('[name="landlord"]');
	$landLordTypes.forEach(($landLordType) => {
	    $landLordType.addEventListener('change', (e) => {
	    	updateRentingFee();
	    });
	});
})()