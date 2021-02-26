<?php

namespace App\Controller;


use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class FormController extends AbstractController
{
    /**
     * @Route("/form", name="form")
     */
    public function index(Request $request)
    {
        /** @var UploadedFile $file */

        $file=$request->files->get('fileCSV');


        if(!is_null($file)){
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $this->getParameter('upload.path');
            $file->move($path,$filename);
        }
        $fullPath=$path.'/'.$filename;
        if(!empty($fullPath))
        {
            $fileData = fopen($fullPath, 'r');
            $column = fgetcsv($fileData);
            while($row = fgetcsv($fileData))
            {
                $rowData[] = array(
                    'row'  => $row[0]
                );
            }
            $outputCSV = array(
                'column'  => $column,
                'rowData'  => $rowData
            );


        }
        $columntOutput=explode(';',$column[0]);
        $rowOutput=[];
        foreach ($rowData as $key=>$singleRow){
            $rowOutput[]=explode(';',$singleRow['row']);
        }

        $result=['status'=>'success','columns'=>$columntOutput,'rows'=>$rowOutput];
        return new JsonResponse($result);
    }
}
