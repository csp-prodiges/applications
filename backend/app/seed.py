from datetime import date, datetime, timedelta, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    Actualite,
    Admission,
    CantineTransaction,
    Classe,
    Commande,
    Conversation,
    ConversationParticipant,
    Devoir,
    Enfant,
    Evenement,
    Famille,
    Message,
    Note,
    RessourceEnseignant,
    Role,
    Utilisateur,
)
from app.models.admission import StatutAdmission
from app.models.cantine import TypeTransaction
from app.models.commande import StatutCommande, TypeCommande
from app.models.evenement import TypeEvenement
from app.security import hash_password


async def seed_database(session: AsyncSession) -> None:
    existing = await session.scalar(select(Utilisateur).limit(1))
    if existing is not None:
        return

    now = datetime.now(timezone.utc)

    famille_kouassi = Famille(nom_famille="Kouassi")
    session.add(famille_kouassi)
    await session.flush()

    classe_cm1 = Classe(nom="CM1", niveau="CM1")
    classe_ce2 = Classe(nom="CE2", niveau="CE2")
    session.add_all([classe_cm1, classe_ce2])
    await session.flush()

    admin = Utilisateur(
        email="admin@cite-scolaire-prodiges.org",
        password_hash=hash_password("Admin@CSP2026!"),
        role=Role.admin,
        nom="Administration",
        prenom="CSP",
    )
    prof_dupont = Utilisateur(
        email="prof.dupont@cite-scolaire-prodiges.org",
        password_hash=hash_password("Prof@CSP2026!"),
        role=Role.enseignant,
        nom="Dupont",
        prenom="Marie",
        telephone="0600000001",
    )
    parent_kouassi = Utilisateur(
        email="famille.kouassi@example.com",
        password_hash=hash_password("Famille@CSP2026!"),
        role=Role.parent,
        nom="Kouassi",
        prenom="Jean",
        telephone="0600000002",
        famille_id=famille_kouassi.id,
    )
    session.add_all([admin, prof_dupont, parent_kouassi])
    await session.flush()

    classe_cm1.enseignant_principal_id = prof_dupont.id
    await session.flush()

    ange = Enfant(
        famille_id=famille_kouassi.id,
        prenom="Ange",
        nom="Kouassi",
        date_naissance=date(2016, 3, 12),
        classe_id=classe_cm1.id,
    )
    grace = Enfant(
        famille_id=famille_kouassi.id,
        prenom="Grace",
        nom="Kouassi",
        date_naissance=date(2018, 7, 4),
        classe_id=classe_ce2.id,
    )
    session.add_all([ange, grace])
    await session.flush()

    notes = [
        Note(enfant_id=ange.id, matiere="Mathématiques", valeur=15.2, bareme=20,
             date=now.date() - timedelta(days=3), commentaire="Bon trimestre",
             enseignant_id=prof_dupont.id),
        Note(enfant_id=ange.id, matiere="Français", valeur=14.0, bareme=20,
             date=now.date() - timedelta(days=7), enseignant_id=prof_dupont.id),
        Note(enfant_id=ange.id, matiere="Étude biblique", valeur=17.5, bareme=20,
             date=now.date() - timedelta(days=10), enseignant_id=prof_dupont.id),
        Note(enfant_id=grace.id, matiere="Mathématiques", valeur=16.0, bareme=20,
             date=now.date() - timedelta(days=4), enseignant_id=prof_dupont.id),
    ]
    session.add_all(notes)

    devoirs = [
        Devoir(classe_id=classe_cm1.id, matiere="Français", titre="Exercices de conjugaison",
               description="Conjuguer les verbes du 1er groupe au passé composé.",
               date_limite=now.date() + timedelta(days=2), enseignant_id=prof_dupont.id),
        Devoir(classe_id=classe_cm1.id, matiere="Mathématiques", titre="Fractions",
               description="Fiche d'exercices sur les fractions simples.",
               date_limite=now.date() + timedelta(days=4), enseignant_id=prof_dupont.id),
        Devoir(classe_id=classe_cm1.id, matiere="Étude biblique", titre="Mémoriser Psaume 23",
               date_limite=now.date() + timedelta(days=6), enseignant_id=prof_dupont.id),
    ]
    session.add_all(devoirs)

    evenements = [
        Evenement(titre="Sortie culturelle", description="Visite du musée, prévoir un sac à dos.",
                   date_debut=now + timedelta(days=9), type=TypeEvenement.sortie,
                   classe_id=classe_cm1.id),
        Evenement(titre="Réunion parents-professeurs", description="Bilan du trimestre.",
                   date_debut=now + timedelta(days=15), type=TypeEvenement.reunion),
        Evenement(titre="Atelier parents : accompagner son enfant",
                   description="Samedi 10h, salle polyvalente.",
                   date_debut=now + timedelta(days=5, hours=10), type=TypeEvenement.autre),
    ]
    session.add_all(evenements)

    cantine_transactions = [
        CantineTransaction(enfant_id=ange.id, montant=80, type=TypeTransaction.credit,
                             description="Rechargement cantine"),
        CantineTransaction(enfant_id=ange.id, montant=25, type=TypeTransaction.debit,
                             description="Repas de la semaine"),
        CantineTransaction(enfant_id=ange.id, montant=45, type=TypeTransaction.debit,
                             description="Sortie culturelle"),
        CantineTransaction(enfant_id=grace.id, montant=60, type=TypeTransaction.credit,
                             description="Rechargement cantine"),
    ]
    session.add_all(cantine_transactions)

    commande_uniforme = Commande(
        famille_id=famille_kouassi.id,
        type=TypeCommande.uniforme,
        details={"article": "Uniforme complet", "taille": "8 ans", "quantite": 1},
        montant=30,
        statut=StatutCommande.en_attente,
    )
    session.add(commande_uniforme)

    actualites = [
        Actualite(titre="Voyage linguistique de fin d'année : inscriptions ouvertes",
                   contenu="Les inscriptions pour le séjour linguistique et culturel de fin "
                            "d'année sont ouvertes. Places limitées, inscrivez-vous avant le "
                            "30 du mois.",
                   public=True, auteur_id=admin.id),
        Actualite(titre="Atelier parents « accompagner son enfant » — samedi 10h",
                   contenu="Un atelier pour les parents sur l'accompagnement scolaire et "
                            "éducatif, animé par l'équipe pédagogique.",
                   public=False, auteur_id=admin.id),
        Actualite(titre="Commande d'uniformes disponible jusqu'au 30 du mois",
                   contenu="La commande groupée d'uniformes est ouverte jusqu'à la fin du "
                            "mois. Passez votre commande depuis l'espace « Commandes ».",
                   public=False, auteur_id=admin.id),
        Actualite(titre="Portes ouvertes de la Cité Scolaire Prodiges",
                   contenu="Venez découvrir notre projet éducatif, nos sections et notre "
                            "équipe pédagogique lors de notre journée portes ouvertes.",
                   public=True, auteur_id=admin.id),
    ]
    session.add_all(actualites)

    admissions = [
        Admission(nom_enfant="Nguema", prenom_enfant="Divine", date_naissance=date(2019, 2, 14),
                    niveau_souhaite="CP", nom_parent="Sylvie Nguema",
                    email_parent="sylvie.nguema@example.com", telephone_parent="0611223344",
                    message="Nous souhaitons inscrire notre fille pour la rentrée prochaine.",
                    statut=StatutAdmission.nouvelle),
        Admission(nom_enfant="Traoré", prenom_enfant="Samuel", date_naissance=date(2017, 9, 30),
                    niveau_souhaite="CE1", nom_parent="Paul Traoré",
                    email_parent="paul.traore@example.com", telephone_parent="0655667788",
                    statut=StatutAdmission.contactee),
    ]
    session.add_all(admissions)

    ressources = [
        RessourceEnseignant(titre="Formation bilinguisme — module 1",
                              description="Support de formation continue sur la pédagogie "
                                           "bilingue en cycle 2.",
                              categorie="Formation continue"),
        RessourceEnseignant(titre="Guide pédagogique — étude biblique",
                              description="Trame annuelle et ressources pour la section "
                                           "étude biblique.",
                              categorie="Pédagogie"),
    ]
    session.add_all(ressources)

    conversation = Conversation(sujet="Bienvenue à la famille Kouassi")
    session.add(conversation)
    await session.flush()
    session.add_all([
        ConversationParticipant(conversation_id=conversation.id, utilisateur_id=admin.id),
        ConversationParticipant(conversation_id=conversation.id, utilisateur_id=parent_kouassi.id),
    ])
    session.add(Message(
        conversation_id=conversation.id,
        auteur_id=admin.id,
        contenu="Bienvenue sur l'intranet de la Cité Scolaire Prodiges ! N'hésitez pas à nous "
                 "écrire ici pour toute question.",
    ))

    await session.commit()
