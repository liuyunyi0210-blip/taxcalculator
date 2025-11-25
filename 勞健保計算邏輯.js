// 勞健保分攤估算計算邏輯
let $monthlySalary;
let $takeCarePeopleCnts;

// 獲取金額範圍
function getRange(amount) {
    let firstRangeAmount = ranges[0].amount;
    let lastRangeAmount = ranges[ranges.length - 1].amount;

    if (amount < firstRangeAmount + 1) {
        let newCurrent = $.extend(true, {}, ranges[0]);
        newCurrent.amount = 1;
        return [newCurrent, ranges[0]];
    }

    if (amount >= lastRangeAmount) {
        return [ranges[ranges.length - 1], ranges[ranges.length - 1]];
    }

    for (let i in ranges) {
        let current = ranges[i];
        let newCurrent = $.extend(true, {}, current);
        let next = ranges[parseInt(i) + 1];

        if (amount >= current.amount && amount <= next.amount) {
            newCurrent.amount += 1;
            return [newCurrent, next];
        }
    }

    return [];
}

// 添加千分位逗號
function addCommas(nStr) {
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
}

// 計算保險費用
function calculateInsurance() {
    const salary = parseInt($monthlySalary.value);
    if (isNaN(salary)) {
        return;
    }

    let [rangeFrom, rangeTo] = getRange(salary);

    const peopleCountValue = parseInt($takeCarePeopleCnts.value);
    
    // 更新投保級距顯示
    $('#range_from').html(addCommas(rangeFrom.amount));
    $('#range_to').html(addCommas(rangeTo.amount));
    $('#salary').html(addCommas(salary));
    
    // 更新勞保費用
    $('#labor_insurance_employee').html(addCommas(rangeTo.labor_insurance_employee));
    $('#labor_insurance_employer').html(addCommas(rangeTo.labor_insurance_employer));
    $('#labor_insurance_subtotal').html(addCommas(rangeTo.labor_insurance_employee + rangeTo.labor_insurance_employer));
    
    // 更新健保費用（考慮眷屬人數）
    $('#health_insurance_employee').html(addCommas(rangeTo.health_insurance_employee * peopleCountValue));
    $('#health_insurance_employer').html(addCommas(rangeTo.health_insurance_employer));
    $('#health_insurance_subtotal').html(addCommas(rangeTo.health_insurance_employee * peopleCountValue + rangeTo.health_insurance_employer));
    
    // 更新退休金
    $('#pension').html(addCommas(rangeTo.pension));
    $('#pension_subtotal').html(addCommas(rangeTo.pension));

    // 計算總計
    const employeeAmount = rangeTo.labor_insurance_employee + (rangeTo.health_insurance_employee * peopleCountValue);
    $('#employee_amount').html(addCommas(employeeAmount));
    $('#employer_amount').html(addCommas(rangeTo.employer_amount));
    $("#final_total").html(addCommas(employeeAmount + rangeTo.employer_amount));
    
    // 計算員工實領和雇主實支
    const netEmployeePay = salary - employeeAmount; // 員工實領 = 投保薪資 - 員工負擔
    const totalEmployerCost = salary + rangeTo.employer_amount; // 雇主實支 = 投保薪資 + 公司負擔
    
    $('#net-employee-pay').html(addCommas(netEmployeePay));
    $('#total-employer-cost').html(addCommas(totalEmployerCost));
}

// ============================================
// 自訂下拉選單功能（用於扶養眷屬選單）
// ============================================

// 如果整合版功能.js 沒有載入，則定義本地函數
if (typeof window.initCustomSelect === 'undefined') {
	// 更新自訂下拉選單顯示文字
	function updateCustomSelectDisplay(selectId, value) {
		const button = document.getElementById(`${selectId}-button`);
		if (!button) return;
		
		const textSpan = button.querySelector('.custom-select-text');
		const options = document.querySelectorAll(`#${selectId}-options .custom-select-option`);
		
		// 移除所有選中狀態
		options.forEach(option => option.classList.remove('selected'));
		
		// 找到對應的選項並更新顯示
		options.forEach(option => {
			if (option.getAttribute('data-value') === value) {
				if (textSpan) textSpan.textContent = option.textContent;
				option.classList.add('selected');
			}
		});
	}

	// 初始化自訂下拉選單
	function initCustomSelect(selectId) {
		const select = document.getElementById(selectId);
		const button = document.getElementById(`${selectId}-button`);
		const options = document.getElementById(`${selectId}-options`);
		
		if (!select || !button || !options) return;
		
		const optionElements = options.querySelectorAll('.custom-select-option');
		
		// 初始化顯示當前選中的值
		const currentValue = select.value;
		updateCustomSelectDisplay(selectId, currentValue);
		
		// 按鈕點擊事件：展開/收起選單
		button.addEventListener('click', function(e) {
			e.stopPropagation();
			const isOpen = options.classList.contains('show');
			
			// 關閉所有其他下拉選單
			document.querySelectorAll('.custom-select-options.show').forEach(opt => {
				if (opt !== options) {
					opt.classList.remove('show');
					const wrapper = opt.closest('.custom-select-wrapper');
					if (wrapper) {
						const otherButton = wrapper.querySelector('.custom-select-button');
						if (otherButton) otherButton.classList.remove('open');
					}
				}
			});
			
			// 切換當前選單
			if (isOpen) {
				options.classList.remove('show');
				button.classList.remove('open');
			} else {
				options.classList.add('show');
				button.classList.add('open');
			}
		});
		
		// 選項點擊事件
		optionElements.forEach(option => {
			option.addEventListener('click', function() {
				const value = this.getAttribute('data-value');
				select.value = value;
				
				// 觸發 change 事件（讓原有的監聽器能正常工作）
				const event = new Event('change', { bubbles: true });
				select.dispatchEvent(event);
				
				// 更新顯示
				updateCustomSelectDisplay(selectId, value);
				
				// 關閉選單
				options.classList.remove('show');
				button.classList.remove('open');
			});
		});
		
		// 點擊外部關閉選單
		document.addEventListener('click', function(e) {
			if (!button.contains(e.target) && !options.contains(e.target)) {
				options.classList.remove('show');
				button.classList.remove('open');
			}
		});
		
		// 監聽原生 select 的 change 事件（以防有其他方式改變值）
		select.addEventListener('change', function() {
			updateCustomSelectDisplay(selectId, this.value);
		});
	}
	
	// 導出到 window（供其他腳本使用）
	window.initCustomSelect = initCustomSelect;
	window.updateCustomSelectDisplay = updateCustomSelectDisplay;
}

// 初始化事件監聽器
(function() {
    $monthlySalary = document.getElementById('salary-monthly');
    $takeCarePeopleCnts = document.getElementById('take-care-people');

    $monthlySalary.addEventListener("input", () => { 
        calculateInsurance(); 
    });

    $takeCarePeopleCnts.addEventListener("change", () => {
        calculateInsurance();
    });
    
    // 初始化扶養眷屬自訂下拉選單（使用 window 上的函數）
    // 使用 setTimeout 確保所有腳本都已載入
    setTimeout(function() {
        const initFn = window.initCustomSelect;
        if (initFn) {
            initFn('take-care-people');
        } else {
            // 如果 window 上還沒有函數，使用本地定義的函數
            if (typeof initCustomSelect !== 'undefined') {
                initCustomSelect('take-care-people');
            }
        }
    }, 100);
})();
