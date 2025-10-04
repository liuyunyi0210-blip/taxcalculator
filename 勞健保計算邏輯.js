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
})();
