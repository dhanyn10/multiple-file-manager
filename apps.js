$("#rename-options").on('change', function(){
    var value = $("#rename-options").val();
    if(value == "delete")
    {
        $(".rename").each(() => {
            $(".rename").removeClass("visible");
        });
        $("#delete-c").addClass("visible");
    }
    if(value == "replace")
    {
        $(".rename").each(() => {
            $(".rename").removeClass("visible");
        });
        $("#replace-c").addClass("visible");
    }
    if(value == "insert")
    {
        $(".rename").each(() => {
            $(".rename").removeClass("visible");
        });
        $("#insert-c").addClass("visible");
    }
});