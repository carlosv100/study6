// javascript/jquery

$(document).ready(function (e) {
    $('#inspectionForm').on('submit', function (e) {
        e.preventDefault();

        var formData = JSON.stringify(validateForm());

        if(!formData) {
            return;
        }

        $.ajax({
                url: '/v1/api/inspection',
                method: 'POST',
                data: formData,
                // contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                contentType: 'application/json',
                cache: false,
                processData: false
            }) //- end AJAX call
            .done(function (data) {
                console.log('AJAX callback response:', JSON.stringify(data));
                window.location.href = '/v1/inspection';
            }) //= end AJAX done
            .fail(function (jqXHR, textStatus, err) {
                console.log('AJAX error response: ', textStatus);
                alert('Error Saving record!');
            }); //- end AJAX fail
    }); //- end form submit $('#inspectionForm').on( 'sumbit', handler )

    $('#assets').on('change', function () {
        
        var selectedAsset = this[this.options.selectedIndex].value;
        $.post(`http://carlosv8:8080/v1/inspection/itemsList/${selectedAsset}`,loadItems);
    });

    function loadItems(data,status,jqXHR) { 
        let itemString = '';
        var rowcount = 0;
        if(data.length == 0) {
            itemString = "<p> No Data found";
        } else {
            data.forEach((item,index) => {
                itemString += `
                <div class="row" id="row${rowcount}">
                    <div class="col" id="row${rowcount}_itemname">${item}</div>

                    <div class="col border-3" cat="radio" feature="${item}" id="row${rowcount}_StatusContainer">  <!-- staus column -->
                        <div class="form-check form-check-inline" id="row${rowcount}_PassContainer">
                            <label class="col align-middle form-check-label" for="row${rowcount}_Pass">Pass</label>
                            <input class="col form-control form-check-input" row="${rowcount}" type="radio" status="Pass" name="${item}" checked id="row${rowcount}_Pass">
                        </div>
                        <div class="form-check form-check-inline" id="row${rowcount}_FailContainer">
                            <label class="col align-middle form-check-label" for="row${rowcount}_Fail">Fail</label>
                            <input class="col form-control form-check-input" row="${rowcount}" type="radio" status="Fail" name="${item}" id="row${rowcount}_Fail">
                        </div>
                    </div> <!-- end status column -->
                    <div class="col invisible errbox" id="row${rowcount}_Error"> <- select Pass or Fail </div>
                    <div class="col">
                        <input class="form-control" type="text" id="row${rowcount}_comments" placeholder="no comments">
                    </div>
                </div>`;    
                rowcount++;
            });
        }

        //$('#items').load(itemString);
        $('#items').html(itemString);
        //document.getElementById('items').innerHTML = itemString;

    }

}); //- end $(document).ready( handler )



function validateForm() {
    //basic submit has 6 elements (including the submit button)
    // ... with selected asset('crane'), there are "ItemList" length * 3 (plus 6 base items)
    // multipy by 3 meaning the fails, passes, comment that initially come in.

    //separat the elements into SELECTs and INPUTs
    var remediateElements = [];
    var data = {};
    var inspectRecord = {};
    var inspectItems = [];

    //Asset
    var assetElement = document.getElementById('assets');
    if(assetElement.selectedIndex == 0) {
        remediateElements.push(assetElement.id);
    }

    //control Mode
    var controlModeElement = document.getElementById('control_mode');
    if(controlModeElement.selectedIndex == 0) {
        remediateElements.push(controlModeElement.id);
    }
    //Operator
    var operatorElement = document.getElementById('operator_name');
    if(operatorElement.value.length == 0) {
        remediateElements.push(operatorElement.id);
    }
    
    //Status
    for(let i = 0; i < document.getElementById('items').children.length; i++) {
        if(!(document.getElementById(`row${i}_Pass`).checked || document.getElementById(`row${i}_Fail`).checked)) {
            remediateElements.push(document.getElementById(`row${i}_StatusContainer`).id);
        }
    }
    
    if(remediateElements.length > 0) {
        flagElements(remediateElements);
        return;
    }


    //Date
    inspectRecord.Date = document.getElementById('cDate').value;

    //Time
    inspectRecord.Time = document.getElementById('cTime').value;
    
    //Asset
    var selectedAsset = document.getElementById('assets');
    inspectRecord.Asset = selectedAsset.options[selectedAsset.selectedIndex].value;

    //Control Mode
    var selectedControl = document.getElementById('control_mode');
    inspectRecord.ControlMode = selectedControl.options[selectedControl.selectedIndex].value;

    //Operator
    inspectRecord.Operator = document.getElementById('operator_name').value;

    data.inspectRecord = inspectRecord;

    //Item row data
    for(let i = 0; i < document.getElementById('items').children.length; i++) {
        inspectItems[i] = { itemname : document.getElementById(`row${i}_itemname`).innerText,
                            status : document.getElementById(`row${i}_Pass`).attributes.status.value,
                            comments: document.getElementById(`row${i}_comments`).value
                        };
    }

    data.inspectItems = inspectItems;

    if(remediateElements.length > 0) {
        return 0;
    } else {
        return data;
    }
}

function flagElements(remediateItems) {
    remediateItems.forEach(element => {
        var el = document.getElementById(element);

        if(element.search('StatusContainer')>= 0) {
            el.classList.add('error_border');
            el.children[0].children[1].addEventListener('click', clearFlag);
            el.children[1].children[1].addEventListener('click', clearFlag);
        } else {
            el.classList.add('error_border');
            el.addEventListener('click', clearFlag);
        }
    });
}

function clearFlag(event) {
    //event.preventDefault()
    let element = document.getElementById(event.target.id);
    if(element.id.search(/Pass|Fail/) >= 0) {
        let row = element.attributes.row.value;
        document.getElementById('row'+row+'_StatusContainer').classList.remove('error_border');
    } else {
        element.classList.remove('error_border');
    }
}