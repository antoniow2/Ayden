import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import Header from './Header';
import Footer from './Footer';

function DietaryRestrictions() {
    const [mediterranean, setMediterranean] = useState(false)
    const [dairyFree, setDairyFree] = useState(false)
    const [glutenFree, setGlutenFree] = useState(false)
    const [wheatFree, setWheatFree] = useState(false)
    const [eggFree, setEggFree] = useState(false)
    const [peanutFree, setPeanutFree] = useState(false)
    const [treeNutFree, setTreeNutFree] = useState(false)
    const [fishFree, setFishFree] = useState(false)
    const [soyFree, setSoyFree] = useState(false)
    const [shellfishFree, setShellfishFree] = useState(false)
    const [porkFree, setPorkFree] = useState(false)
    const [redMeatFree, setRedMeatFree] = useState(false)
    const [crustaceanFree, setCrustaceanFree] = useState(false)
    const [celeryFree, setCeleryFree] = useState(false)
    const [mustardFree, setMustardFree] = useState(false)
    const [sesameFree, setSesameFree] = useState(false)
    const [lupineFree, setLupineFree] = useState(false)
    const [molluskFree, setMolluskFree] = useState(false)
    const [kosherFree, setKosherFree] = useState(false)

    const [savedRestrictions, setSavedRestrictions] = useState({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await Axios.get('http://localhost:3001/users/dietaryRestrictionslist', {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${Cookies.get('userToken')}`,
                    },
                })

                const fetchedRestrictions  = response.data.savedRestrictions

                setSavedRestrictions(fetchedRestrictions )

                setMediterranean(fetchedRestrictions.mediterranean)
                setDairyFree(fetchedRestrictions.dairyFree)
                setGlutenFree(fetchedRestrictions.glutenFree)
                setWheatFree(fetchedRestrictions.wheatFree)
                setEggFree(fetchedRestrictions.eggFree)
                setPeanutFree(fetchedRestrictions.peanutFree)
                setTreeNutFree(fetchedRestrictions.treeNutFree)
                setFishFree(fetchedRestrictions.fishFree)
                setSoyFree(fetchedRestrictions.soyFree)
                setShellfishFree(fetchedRestrictions.shellfishFree)
                setPorkFree(fetchedRestrictions.porkFree)
                setRedMeatFree(fetchedRestrictions.redMeatFree)
                setCrustaceanFree(fetchedRestrictions.crustaceanFree)
                setCeleryFree(fetchedRestrictions.celeryFree)
                setMustardFree(fetchedRestrictions.mustardFree)
                setSesameFree(fetchedRestrictions.sesameFree)
                setLupineFree(fetchedRestrictions.lupineFree)
                setMolluskFree(fetchedRestrictions.molluskFree)
                setKosherFree(fetchedRestrictions.kosherFree)

            }
            catch(error) {
                console.error('Error fetching dietary restrictions:', error)
            }
        }
        fetchData()
    }, [])

    const handleSave = async (event) => {
        event.preventDefault();
        const selectedRestrictions = {
            mediterranean,
            dairyFree,
            glutenFree,
            wheatFree,
            eggFree,
            peanutFree,
            treeNutFree,
            soyFree,
            fishFree,
            shellfishFree,
            porkFree,
            redMeatFree,
            crustaceanFree,
            celeryFree,
            mustardFree,
            sesameFree,
            lupineFree,
            molluskFree,
            kosherFree,
        }
        console.log('Selected Dietary Restrictions:', selectedRestrictions)

        try {
            const response = await Axios.post('http://localhost:3001/users/dietaryRestrictions', 
            selectedRestrictions, {
            withCredentials: true, 
                headers: {
                    Authorization: `Bearer ${Cookies.get('userToken')}`,
                },
            })
            console.log('Response:', response.data)
        }
        catch (error){
            console.error('Error:', error)
        }
    }  

    return (
        <div>
            <Header/>
            <nav>
            </nav>
            <div>
                <h1>Dietary Restrictions</h1>
                <form onSubmit={handleSave}>
                    <label>
                            Mediterranean
                            <input
                                type="checkbox"
                                checked={mediterranean}
                                onChange={() => setMediterranean(!mediterranean)}
                            />
                    </label>
                    <label>
                            Dairy-Free
                            <input
                                type="checkbox"
                                checked={dairyFree}
                                onChange={() => setDairyFree(!dairyFree)}
                            />
                    </label>
                    <label>
                            Gluten-Free
                            <input
                                type="checkbox"
                                checked={glutenFree}
                                onChange={() => setGlutenFree(!glutenFree)}
                            />
                    </label> 
                    <label>
                            Wheat-Free
                            <input
                                type="checkbox"
                                checked={wheatFree}
                                onChange={() => setWheatFree(!wheatFree)}
                            />
                    </label>
                    <label>
                            Egg-Free
                            <input
                                type="checkbox"
                                checked={eggFree}
                                onChange={() => setEggFree(!eggFree)}
                            />
                    </label>  
                    <label>
                            Peanut-Free
                            <input
                                type="checkbox"
                                checked={peanutFree}
                                onChange={() => setPeanutFree(!peanutFree)}
                            />
                    </label>
                    <label>
                            Tree-Nut-Free
                            <input
                                type="checkbox"
                                checked={treeNutFree}
                                onChange={() => setTreeNutFree(!treeNutFree)}
                            />
                    </label> 
                    <label>
                            Soy-Free
                            <input
                                type="checkbox"
                                checked={soyFree}
                                onChange={() => setSoyFree(!soyFree)}
                            />
                    </label>
                    <label>
                            Fish-Free
                            <input
                                type="checkbox"
                                checked={fishFree}
                                onChange={() => setFishFree(!fishFree)}
                            />
                    </label>
                    <label>
                            Shellfish-Free
                            <input
                                type="checkbox"
                                checked={shellfishFree}
                                onChange={() => setShellfishFree(!shellfishFree)}
                            />
                    </label>
                    <label>
                            Pork-Free
                            <input
                                type="checkbox"
                                checked={porkFree}
                                onChange={() => setPorkFree(!porkFree)}
                            />
                    </label>
                    <label>
                            Red-Meat-Free
                            <input
                                type="checkbox"
                                checked={redMeatFree}
                                onChange={() => setRedMeatFree(!redMeatFree)}
                            />
                    </label>
                    <label>
                            Crustacean-Free
                            <input
                                type="checkbox"
                                checked={crustaceanFree}
                                onChange={() => setCrustaceanFree(!crustaceanFree)}
                            />
                    </label>
                    <label>
                            Celery-Free
                            <input
                                type="checkbox"
                                checked={celeryFree}
                                onChange={() => setCeleryFree(!celeryFree)}
                            />
                    </label>
                    <label>
                            Mustard-Free
                            <input
                                type="checkbox"
                                checked={mustardFree}
                                onChange={() => setMustardFree(!mustardFree)}
                            />
                    </label>
                    <label>
                            Sesame-Free
                            <input
                                type="checkbox"
                                checked={sesameFree}
                                onChange={() => setSesameFree(!sesameFree)}
                            />
                    </label>
                    <label>
                            Lupine-Free
                            <input
                                type="checkbox"
                                checked={lupineFree}
                                onChange={() => setLupineFree(!lupineFree)}
                            />
                    </label>
                    <label>
                            Mollusk-Free
                            <input
                                type="checkbox"
                                checked={molluskFree}
                                onChange={() => setMolluskFree(!molluskFree)}
                            />
                    </label> 
                    <label>
                            Kosher-Free
                            <input
                                type="checkbox"
                                checked={kosherFree}
                                onChange={() => setKosherFree(!kosherFree)}
                            />
                    </label> 
                    <button type="submit">Save</button>               
                </form>
                <div className="saved-restrictions">
                    <h2>Saved Dietary Restrictions</h2>
                    {Object.entries(savedRestrictions).map(([restriction, value]) => (
                        <div key={restriction} className="saved-restriction-item">
                            {restriction}: {value ? 'Yes' : 'No'}
                        </div>
                    ))}
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default DietaryRestrictions