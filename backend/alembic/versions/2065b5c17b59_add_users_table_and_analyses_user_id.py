"""add users table and analyses.user_id

Revision ID: 2065b5c17b59
Revises: 2ad6ea492fb4
Create Date: 2026-07-04 19:21:56.727808

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2065b5c17b59'
down_revision: Union[str, Sequence[str], None] = '2ad6ea492fb4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Pre-auth analyses have no owner and user_id is NOT NULL, so purge
    # them (approved: only disposable test data exists at this point).
    op.execute("DELETE FROM qa_sessions")
    op.execute("DELETE FROM analyses")

    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('hashed_password', sa.String(length=255), nullable=False),
    sa.Column('role', sa.String(length=20), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)
    op.add_column('analyses', sa.Column('user_id', sa.Integer(), nullable=False))
    op.create_index(op.f('ix_analyses_user_id'), 'analyses', ['user_id'], unique=False)
    op.create_foreign_key('fk_analyses_user_id_users', 'analyses', 'users', ['user_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('fk_analyses_user_id_users', 'analyses', type_='foreignkey')
    op.drop_index(op.f('ix_analyses_user_id'), table_name='analyses')
    op.drop_column('analyses', 'user_id')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
