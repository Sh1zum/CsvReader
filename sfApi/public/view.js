$( document ).ready(function() {
function validationFile(file){
    let ext =file.split('.').pop().toLowerCase();
    if($.inArray(ext, ['csv']) == -1) {
        alert('invalid extension!');
        return false;
    }
    if (file == '') {
        alert('Plik pusty');
        return false;
    }
}

    $('.file_save_form').on('submit', function(e) {
        e.preventDefault();
        let file = $('input[name="fileCSV"]').val();
        validationFile(file);

        $('body').css('cursor', 'wait');
        $.ajax({
            url: saveFilePath,
            data: new FormData($(this)[0]),
            type: "post",
            processData: false,
            contentType: false,
            cache: false,
            dataType: "json",
            error: function(error) {
                console.error(error);
            },
            success: function(data) {
                $('body').css('cursor', 'default');
                if (data.status == 'success') {
                    alert('Plik poprawnie zapisany');
                    let table='';
                    table=table+'<table class="mdc-data-table__table"><thead><tr class="mdc-data-table__header-row">';
                    $.each(data.columns, function(key, value) {
                        table=table+'<th class="mdc-data-table__header-cell">'+value+'</th>';
                    });

                    table=table+'</tr></thead><tbody class="mdc-data-table__content">';
                    $.each(data.rows, function(key, value) {
                        table=table+'<tr class="mdc-data-table__row">';
                        $.each(value, function(key2, value2) {
                            table=table+'<td class="mdc-data-table__cell">'+value2+'</td>';
                        });
                        table=table+'</tr>';
                    });
                    table=table+'</tbody></table>';
                    $('#container').append(table);
                } else {
                    alert('Wystąpił błąd. Plik nie zapisany');
                }
            },
            complete: function(){
                $('body').css('cursor', 'default');
            }
        });

        return false;
    });



});