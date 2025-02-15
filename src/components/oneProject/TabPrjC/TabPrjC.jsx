import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./TabPrjC.scss";
import AddTaskIcon from '@mui/icons-material/AddTask';
import API from "../../../api/index";
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import StatSingelPrj from "../StatistiqueSingelPrj/StatSingelPrj";

const TabPrjC = () => {
    const params = useParams();
    const [state, setState] = useState(false);
    const [norme, setNorme] = useState();
    const [chapitre, setChapitre] = useState([]);
    const [article, setArticle] = useState([]);
    const [question, setQuestion] = useState([]);
    const [resQuestion, setResQuestion] = useState([]);
    const [id, setid] = useState();
    const [evaluation, setevaluation] = useState("");
    const [observation, setobservation] = useState("");
    const navigate = useNavigate();

    const handelClick = (id) => {
        let result = { id, evaluation, observation }

        API.
            patch('updateResult', result)
            .then((res) => {
                console.log(res);
            }).catch((err) => console.log(err));
        console.log(result)
    }

    const exportPDF = () => {
        const input = document.getElementById("tab")
        html2canvas(input, { logging: true, letterRendering: 1, useCORS: true }).then((canvas) => {
            const imgWidth = 208;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            const imgData = canvas.toDataURL("/img/png");
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save("Rapport.pdf")
        }
        )
    };

    useEffect(() => {
        API.get(`/getbyId_projet/${params.id}`).then((result) => {
            const data = result.data;
            setNorme(data.norme);
            setChapitre(data.chapitre);
            setArticle(data.articles);
            setQuestion(data.questions);
            API.get(`/getResultsByProject/${params.id}`).then((result) => {
                const data = result.data;
                setResQuestion(data);
                setState(true);
            });
        });
    }, []);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const id_prj = params.id;
    const NormIso =norme?.norme;

    return (
        <>
            {state ? (
                <div className="nav_bott">
                    <ul>
                        {/* <li><a className="active" href="#">Diagnostic</a></li>
                        <li><a href="#news">Résultats globaux</a></li>  */}
                        <li>
                            <div className="reg_prj">
                                <a onClick={exportPDF}>Export PDF</a>
                                <a onClick={handleShow}>Résultats globaux</a>
                            </div>
                        </li>
                    </ul>
                    <StatSingelPrj data={{ handleClose: handleClose, show: show, chapitre, id_prj, NormIso }} />
                    <div id="tab" className="tab">
                        <br /><br />
                        <p className="norme">Grille d'autoévaluation selon la norme: {norme.norme}</p>
                        <div className="discription">
                            <div className="a">
                                <div>Organisme évalué : </div>
                                <div>Evaluateur : </div>
                                <div>Date évaluation : </div>
                            </div>
                            <div className="b">
                                <div>{params.n_e}</div>
                                <div>{params.n_c}</div>
                                <div>{params.d_d} et {params.d_f}</div>
                            </div>
                        </div>
                        <br />
                        <table className="table table-bordered  tb">
                            <thead className="head">
                                <tr>
                                    <th className="col-sm-1">Chapitre</th>
                                    <th className="aqeon">
                                        <td className="a">Articles</td>
                                        <td className="q">Questions</td>
                                        <td className="e">evaluation</td>
                                        <td className="o">observation</td>
                                        <td className="n">note</td>
                                        <td className="ac"></td>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {chapitre.map((chap) => (
                                    <tr key={chap.id} className="">
                                        <td className="chap">{chap.Chapitres}</td>
                                        <td>
                                            <table key={chap.id} className="table table-bordered">

                                                <tbody>
                                                    {article.map((art) =>
                                                        art.ChapitreId === chap.id ? (
                                                            <tr key={art.id}>
                                                                <td className="col-sm-2 art">{art.Articles}</td>
                                                                {art.ChapitreId == chap.id
                                                                    ? question.map((quest) =>
                                                                        quest.ArticleId == art.id ? (
                                                                            <table key={quest.id} className="table">
                                                                                <tbody>
                                                                                    <tr key={quest.id}>
                                                                                        {/* <td onChange={handleChange}>{quest?.id}</td> */}
                                                                                        {/* <input type="text" id="id_question" name={`${i}`} value={quest[i]?.id} onChange={handleChange3} hidden /> */}
                                                                                        <td className="col-sm-3 quest">{quest.Questions}</td>
                                                                                        <td className="col-sm-3">
                                                                                            {resQuestion.map(
                                                                                                (rquest) =>
                                                                                                    rquest.id_question == quest.id ? (
                                                                                                        <tr key={rquest.id}>
                                                                                                            <td className="col-sm-2">
                                                                                                                {rquest.evaluation == null ? (
                                                                                                                    <>
                                                                                                                        <select name="evaluation" onChange={(e) => setevaluation(e.target.value)}>
                                                                                                                            <option value="Exclus">  Exclus     </option>
                                                                                                                            <option value="Conforme">  Conforme   </option>
                                                                                                                            <option value="Acceptable">  Acceptable   </option>
                                                                                                                            <option value="Aaméliorer"> Aaméliorer   </option>
                                                                                                                            <option value="Non-conforme"> Non-conforme </option>
                                                                                                                        </select>
                                                                                                                    </>
                                                                                                                ) : (
                                                                                                                    <select name="evaluation" id="evaluation" onChange={(e) => setevaluation(e.target.value)}>
                                                                                                                        <option value="v" hidden>{rquest.evaluation}</option>
                                                                                                                        <option value="Exclus">  Exclus     </option>
                                                                                                                        <option value="Conforme">  Conforme   </option>
                                                                                                                        <option value="Acceptable">  Acceptable   </option>
                                                                                                                        <option value="Aaméliorer"> Aaméliorer   </option>
                                                                                                                        <option value="Non-conforme"> Non-conforme </option>
                                                                                                                    </select>
                                                                                                                )}
                                                                                                            </td>
                                                                                                            <td className="col-sm-5">
                                                                                                                {rquest.observation == null ? (
                                                                                                                    <textarea id="observation" name="observation" rows="2" cols="27" onChange={(e) => setobservation(e.target.value)} />
                                                                                                                ) : (
                                                                                                                    <textarea id="observation" name="observation" rows="2" cols="27" onChange={(e) => setobservation(e.target.value)} defaultValue={rquest.observation} />
                                                                                                                )}
                                                                                                            </td>
                                                                                                            {evaluation == null && observation == null ? (
                                                                                                                null
                                                                                                            ) : (
                                                                                                                <>
                                                                                                                    <div className="res_qeus">
                                                                                                                        <a onClick={(e) => { handelClick(rquest.id) }}><AddTaskIcon /></a>
                                                                                                                    </div>
                                                                                                                    {/* <input name="id" id="id" value={rquest?.id}/> */}
                                                                                                                </>
                                                                                                            )}
                                                                                                            <td className="col-sm-1 note_">
                                                                                                                {rquest.note == null ? (
                                                                                                                    <p>NA</p>
                                                                                                                ) : (
                                                                                                                    <p>{rquest.note}%</p>
                                                                                                                )}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    ) : null
                                                                                            )}
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        ) : null
                                                                    ) : null}
                                                            </tr>
                                                        ) : null
                                                    )}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody >
                        </table >
                    </div>
                </div >) : null
            }
        </>
    );
};

export default TabPrjC;
